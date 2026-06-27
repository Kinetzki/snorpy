import { IPendingRequest, IRequest, IResponse } from "@/interfaces/logInterfaces";
import { ipcMain, WebContents } from "electron";
import * as mockttp from "mockttp";
import { Parser } from "./parser";

export class ProxyManager {
    private webContents: WebContents;
    private server = mockttp.getLocal();
    private port = 8080;
    private targetDomain = "*";
    private isActive: boolean = false;
    private isIntercept: boolean = false;
    private pendingRequests = new Map<string, IPendingRequest>;

    constructor(webContents: WebContents, private serverHttps: {key: string, cert: string}) {
        this.webContents = webContents;
        this.setupHandlers();
    }

    public setWebContents(webContents: WebContents) {
        this.webContents = webContents;
    }

    private clearAllRequests(action: 'resume' | 'drop' = 'drop') {
        const clearedIds:string[] = [];
        this.pendingRequests.forEach((pendingReq) => {
            const { requestId, resolver, data } = pendingReq;
            if (!this.webContents.isDestroyed()) {
                this.webContents.send("proxy:request-passthrough", data);
            }
            resolver(action); 
            clearedIds.push(requestId)
        });

        this.pendingRequests.clear();
        if (!this.webContents.isDestroyed()) {
            this.webContents.send("proxy:requests-cleared", clearedIds);
        }

        console.log("All pending requests have been cleared.");
    }

    private checkTarget (targetDomain: string, filter: string): boolean {
        if (filter === "*") return true;

        if (filter.startsWith("*.")){
            // split
            const baseDomain = filter.substring(2);
            return targetDomain === baseDomain || targetDomain.endsWith("." + baseDomain);
        }
        

        return targetDomain === filter;
    }

    private filterPendingRequests(target: string, action: "resume" | "drop" = "drop") {
        const clearedIds:string[] = [];
        this.pendingRequests.forEach((pendingReq) => {
            const { requestId, data, resolver } = pendingReq;
            const isMatch = this.checkTarget(data.destination, target);
            if (isMatch) {
                this.webContents.send("proxy:request-passthrough", data);
                resolver(action)
                this.pendingRequests.delete(requestId)
                clearedIds.push(requestId)
            }
        })
        this.webContents.send("proxy:requests-cleared", clearedIds);
    }

    private setPort(port: number) {
        this.port = port;
        console.log("Port set to", port)
    }

    private setTargetDomain(domain: string) {
        this.filterPendingRequests(domain, "resume")
        this.targetDomain = domain;
    }

    private async generateReqPayload (req: mockttp.CompletedRequest): Promise<{
        requestId: string, payload: IRequest
    }> {
        const requestId = req.id;
        const parsedBody = await Parser.parseBodyAsText(req.headers, req.body)

        const reqPayload = {
            id: requestId,
            method: req.method,
            body: parsedBody,
            headers: {...req.headers},
            url: req.url,
            path: req.path,
            http: req.httpVersion,
            destination: req.destination.hostname
        }

        return {requestId, payload: reqPayload}
    }


    private async generateResPayload (res: mockttp.requestSteps.PassThroughResponse): Promise<{
        responseId: string,
        payload: IResponse
    }> {
        const responseId = res.id;
        const parsedBody = await Parser.parseBodyAsText(res.headers, res.body)

        const resPayload = {
            id: responseId,
            statusCode: res.statusCode,
            body: parsedBody,
            headers: {...res.headers}
        }

        return {responseId, payload: resPayload}
    }

    private checkIntercept (destination: string): boolean {
        const isMatch = this.checkTarget(destination, this.targetDomain);

        return isMatch && this.isIntercept;
    }
    
    private setupHandlers() {
        // handler for starting
        ipcMain.handle("proxy:start", async () => {
            try {
                if (this.isActive) {
                    return {
                        success: true,
                        url: this.server.url
                    }
                }
                this.server = mockttp.getLocal({ https: this.serverHttps });

                await this.server.start(this.port)
                const serverUrl = this.server.url;
                const serverCert = this.serverHttps.cert;
                // const serverKey = serverHttps.key;

                this.isActive = true;

                // await this.server.forAnyRequest().thenPassThrough();
                await this.server.forAnyRequest().thenPassThrough({
                    beforeRequest: async (req) => {
                        const { requestId, payload } = await this.generateReqPayload(req);

                        const action = await new Promise<"resume" | "drop">((resolve) => {
                            const isIntercept = this.checkIntercept(payload.destination);
                            console.log("Intercept", isIntercept, this.targetDomain, payload.destination)
                            if (isIntercept) {
                                this.webContents.send("proxy:request-intercepted", payload);
                                const newPendingData: IPendingRequest = {
                                    requestId,
                                    data: payload,
                                    resolver: resolve
                                }
                                this.pendingRequests.set(requestId, newPendingData)
                            } else {
                                if (this.checkTarget(payload.destination, this.targetDomain)) {
                                    this.webContents.send("proxy:request-passthrough", payload);
                                }
                                
                                return resolve("resume")
                            }
                        });

                        this.pendingRequests.delete(requestId);

                        if (action === "drop") {
                            console.log("Request dropped");
                            return {
                                response: "close" as const
                            }
                        }

                        console.log("Request forwarded");
                        return {};

                    },
                    beforeResponse: async (res) => {
                        const { payload } = await this.generateResPayload(res);

                        this.webContents.send("proxy:response-intercepted", payload);

                        return {}
                    }
                })

                console.log("Proxy Started")
                return {
                    success: true,
                    url: serverUrl,
                    cert: serverCert,
                    // key: serverKey
                }
            } catch (error) {
                this.isActive = false;
                return {
                    success: false,
                    error: String(error),
                }
            }
        });

        // handler to resume request
        ipcMain.handle("proxy:resume-request", async (_event, requestId: string) => {
            const pendingRequest = this.pendingRequests.get(requestId);

            if (pendingRequest) {
                const { data, resolver } = pendingRequest;
                this.webContents.send("proxy:request-passthrough", data);
                resolver("resume");
                this.pendingRequests.delete(requestId);
                this.webContents.send("proxy:requests-cleared", [requestId]);
            }
        })

        // handler to drop request
        ipcMain.handle("proxy:drop-request", async (_event, requestId: string) => {
            const pendingRequest = this.pendingRequests.get(requestId);
            if (pendingRequest) {
                const { resolver } = pendingRequest;
                resolver("drop");
                this.pendingRequests.delete(requestId);
            }
            this.webContents.send("proxy:requests-cleared", [requestId]);
            return {
                success: true,
                message: "Request dropped"
            }
        })

        // stop proxy
        ipcMain.handle("proxy:stop", async () => {
            if (!this.isActive) {
                return {
                    success: false,
                    error: "Proxy is not running"
                }
            }

            await this.server.stop()

            this.clearAllRequests('resume')
            this.isActive = false;

            console.log("Proxy stopped successfully")
        })

        // update proxy port
        ipcMain.handle("proxy:set-port", (_event, port: number) => {
            if (this.isActive) {
                return {
                    success: false,
                    error: "Proxy is running"
                }
            }

            this.setPort(port);

            return {
                success: true,
                message: "Port updated"
            }
        })

        // update prxo target
        ipcMain.handle("proxy:set-target", (_event, domain: string) => {
            // resume all non-matching
            this.setTargetDomain(domain)
            console.log("Target set to", this.targetDomain)
            return {
                success: true,
                message: "Target domain updated"
            }
        })

        // update intercept state
        ipcMain.handle("proxy:set-intercept", (_event, isIntercept: boolean) => {
            this.isIntercept = isIntercept;
            if (!isIntercept) {
                this.clearAllRequests("resume")
            }
        })
    }

    async stop() {
        try {
            this.clearAllRequests("resume");

            if (this.isActive) {
                await this.server.stop()
                this.isActive = false;
                console.log("Snorpy stopped...")
            }
        } catch (error) {
            console.error("Failed to stop proxy", error)
        }
    }
}
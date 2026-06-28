import { ipcMain, WebContents } from "electron";
import axios, { AxiosResponse } from "axios";
import { IRequest } from "@/interfaces/logInterfaces";
import { Parser } from "./parser";
import { IIntruderRequest, IIntruderResponse } from "@/interfaces/intruderInterfaces";

export class Intruder {
    private webContents: WebContents;
    private sender = axios.create();
    private maxConcurrentRequests = 10;
    private activeRequestController: AbortController | null = null;
    private isStopIntruder: boolean = false;

    constructor(webContents: WebContents) {
        this.webContents = webContents;
        this.setupHandlers();
    }

    public setWebContents(webContents: WebContents) {
        this.webContents = webContents;
    }

    private replacePlaceholders(payload: string, request: IRequest): IRequest {
        const { url, headers, body } = request;
        const sectionRegex = /§[^§]+§/g;
        const substitutedHeaders: Record<string, any> = {};
        let substitutedBody: string | Buffer<any> = "";

        // replace headers
        for (const [header, val] of Object.entries(headers)) {
            if (val === undefined || val === null || val === "") {
                substitutedHeaders[header] = "";
            } else if (Array.isArray(val)) {
                substitutedHeaders[header] = val.map(v => v.replaceAll(sectionRegex, payload))
            } else {
                substitutedHeaders[header] = val.replaceAll(sectionRegex, payload);
            }

        }

        delete substitutedHeaders['content-length'];
        delete substitutedHeaders['Content-Length'];

        delete substitutedHeaders['accept-encoding']; 
        delete substitutedHeaders['Accept-Encoding'];

        // replace body
        if (body && body !== "Error parsing body content") {
            const bodyType = Parser.getRequestType(headers);
            try {
                const substitutedBodyText = body.replaceAll(sectionRegex, payload);
                substitutedBody = Parser.serializeBody(substitutedBodyText, bodyType);
            } catch (e) {
                substitutedBody = body;
            }
        } else {
            substitutedBody = body;
        }

        // replace url params
        const replacedUrl = url.replaceAll(sectionRegex, payload);

        return {
            ...request,
            headers: substitutedHeaders,
            body: substitutedBody,
            url: replacedUrl
        }
    }

    private createRequestBatch(request: IRequest, payloads: string[], concurrency: number): IIntruderRequest[][] {
        const requestBatches: IIntruderRequest[][] = [];

        const requestBatch: IIntruderRequest[] = [];
        for (const payload of payloads) {
            const substitutedRequest = this.replacePlaceholders(payload, request);
            requestBatch.push({
                request: substitutedRequest,
                payload: payload
            });

            if (requestBatch.length === concurrency) {
                requestBatches.push([...requestBatch]);
                requestBatch.splice(0, requestBatch.length);
            }
        }

        if (requestBatch.length > 0) {
            requestBatches.push([...requestBatch]);
        }

        return requestBatches;
    }

    private parseResponse(request: IIntruderRequest, response: AxiosResponse): IIntruderResponse | null {
        let intruderResponse: IIntruderResponse | null = null;
        const { request: { id }, payload } = request;
        try {
            const responseBodyBuffer = Buffer.from(response.data);
            const parsedBody = Parser.parseResponseBufferAsText(responseBodyBuffer, (response.headers["content-type"]??"").toString().toLowerCase())

            return {
                error: null,
                response: {
                    id: id,  
                    statusCode: response.status,
                    body: parsedBody,
                    headers: response.headers
                },
                request: request.request,
                payload: payload
            }
        } catch (e) {
            intruderResponse = {
                error: e,
                response: null,
                request: request.request,
                payload: payload
            }
        }

        return intruderResponse;
    }

    private async sendRequest(request: IIntruderRequest): Promise<{
        request: IIntruderRequest,
        response: AxiosResponse | null,
        payload: string,
        error: any | null
    }> {
        const { request: { method, url, headers, body }, payload } = request;

        try {
            const response = await this.sender({
                method: method,
                url: url,
                headers,
                data: body,
                transformRequest: [],
                validateStatus: () => true,
                responseType: 'arraybuffer',
                signal: this.activeRequestController?.signal
            });
    
            return {
                request: request,
                response: response,
                payload: payload,
                error: null
            }
        } catch (error) {
            return {
                request: request,
                response: null,
                payload: payload,
                error: error
            }
        }
        
    }

    private async sendRequestBatch(requestBatches: IIntruderRequest[][]) {
        // create axios promise with signal for each request
        for (const requestBatch of requestBatches) {
            
            const promises = requestBatch.map(request => {
                if (this.isStopIntruder) return null;
                return this.sendRequest(request)
            });

            const responses = await Promise.allSettled(promises.filter(Boolean));
            if (this.isStopIntruder) break;

            for (const result of responses) {
                if (result.status === 'fulfilled') {
                    if (!result.value) continue;
                    const { request, response, error, payload } = result.value;
                    if (error) {
                        this.webContents.send("intruder:response", {
                            error: error,
                            response: null,
                            request: request.request,
                            payload: payload
                        });
                    } else if (response) {
                        this.webContents.send("intruder:response", this.parseResponse(request, response));
                    } else {
                        this.webContents.send("intruder:response", {
                            error: "No response received",
                            response: null,
                            request: request.request,
                            payload: payload
                        });
                    }
                }
            }
        }
    }

    private setupHandlers() {
        ipcMain.handle("intruder:start", async (_event, params: {
            request: IRequest,
            payloads: string[],
            concurrency: number
        }) => {
            const { request, payloads, concurrency } = params;

            if (concurrency > this.maxConcurrentRequests) {
                return {
                    success: false,
                    message: "Max concurrent requests reached"
                }
            }

            if (this.activeRequestController && !this.activeRequestController.signal.aborted) {
                return {
                    success: false,
                    message: "Intruder already running"
                }
            }

            this.isStopIntruder = false;
            const newAbortController = new AbortController();
            this.activeRequestController = newAbortController;
            try {   
                const requestBatches = this.createRequestBatch(request, payloads, concurrency);
                this.sendRequestBatch(requestBatches).catch((e) => {
                    console.error("Batch Error", e)
                }).finally(() => {
                    this.activeRequestController = null;
                })
            } catch (e) {
                return {
                    success: false,
                    message: String(e)
                }
            }
            return {
                success: true,
                message: "Intruder started"
            }
        })

        ipcMain.handle("intruder:stop", async () => {
            this.stopIntruder();
            return {
                success: true,
                message: "Intruder stopped"
            }
        })
    }

    private stopIntruder() {
        this.isStopIntruder = true;
        if (this.activeRequestController) {
            this.activeRequestController.abort();
        }
        this.activeRequestController = null;
    }
}
import { ipcMain, WebContents } from "electron";
import axios, { AxiosResponse } from "axios";
import { IRequest } from "@/interfaces/logInterfaces";
import { Parser } from "./parser";
import { IIntruderResponse } from "@/interfaces/intruderInterfaces";

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
        const urlParams = new URLSearchParams(url);
        for (const [key, value] of urlParams.entries()) {
            const substitutedValue = value.replaceAll(sectionRegex, payload);
            urlParams.set(key, substitutedValue);
        }

        return {
            ...request,
            headers: substitutedHeaders,
            body: substitutedBody,
            url: urlParams.toString()
        }
    }

    private createRequestBatch(request: IRequest, payloads: string[]): IRequest[][] {
        const requestBatches: IRequest[][] = [];

        const requestBatch: IRequest[] = [];
        for (const payload of payloads) {
            const substitutedRequest = this.replacePlaceholders(payload, request);
            requestBatch.push(substitutedRequest);

            if (requestBatch.length === this.maxConcurrentRequests) {
                requestBatches.push([...requestBatch]);
                requestBatch.splice(0, requestBatch.length);
            }
        }

        if (requestBatch.length > 0) {
            requestBatches.push([...requestBatch]);
        }

        return requestBatches;
    }

    private parseResponse(id: string, response: AxiosResponse): IIntruderResponse | null {
        let intruderResponse: IIntruderResponse | null = null;

        try {
            const responseBodyBuffer = Buffer.from(response.data);
            const parsedBody = Parser.parseResponseBufferAsText(responseBodyBuffer, (response.headers["content-type"]??"").toString().toLowerCase())

            return {
                error: null,
                data: {
                    id: id,  
                    statusCode: response.status,
                    body: parsedBody,
                    headers: response.headers
                }   
            }
        } catch (e) {
            intruderResponse = {
                error: e,
                data: null
            }
        }

        return intruderResponse;
    }

    private async sendRequest(request: IRequest): Promise<{
        id: string,
        response: AxiosResponse
    }> {
        const response = await this.sender({
            ...request,
            signal: this.activeRequestController?.signal
        });

        return {
            id: request.id,
            response: response
        }
    }

    private async sendRequestBatch(requestBatches: IRequest[][]) {
        // create axios promise with signal for each request
        for (const requestBatch of requestBatches) {
            if (this.isStopIntruder) break;
            const promises = requestBatch.map(request => this.sendRequest(request));

            const responses = await Promise.all(promises);
            for (const res of responses) {
                const { id, response } = res;
                const intruderResponse = this.parseResponse(id, response);
                this.webContents.send("intruder:response", intruderResponse);
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
            const newAbortController = new AbortController();
            this.activeRequestController = newAbortController;
            try {   
                const requestBatches = this.createRequestBatch(request, payloads);
                await this.sendRequestBatch(requestBatches);
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
        this.isStopIntruder = false;
    }
}
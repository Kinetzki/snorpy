import { IRequest } from "@/interfaces/logInterfaces";
import { ipcMain, WebContents } from "electron";
import axios from "axios";
import { Parser } from "./parser";
import { IRepeaterResponse } from "@/interfaces/repeaterInterfaces";

export class Repeater {
    private webContents: WebContents;
    private sender = axios.create();
    private activeRequestController: AbortController | null = null;

    constructor (webContents: WebContents) {
        this.webContents = webContents;
        this.setup_handlers()
    }

    public setWebContents(webContents: WebContents) {
        this.webContents = webContents;
    }

    private checkOrAbortActiveRequest () {
        if (this.activeRequestController) {
            this.activeRequestController.abort();
        }
    }

    private async sendCapturedRequest(request: IRequest) {
        this.checkOrAbortActiveRequest();
        
        const newABortController = new AbortController();
        this.activeRequestController = newABortController;

        const { method, url, headers, body } = request;

        const updatedHeaders = {...headers}

        delete updatedHeaders['content-length'];
        delete updatedHeaders['Content-Length'];

        delete updatedHeaders['accept-encoding']; 
        delete updatedHeaders['Accept-Encoding'];

        let serializedData: string | Buffer<any> = "";
        const bodyType = Parser.getRequestType(headers);

        if (body && body !== "Error parsing body content") {
            try {
                serializedData = Parser.serializeBody(body, bodyType);
            } catch (e) {
                serializedData = body;
            }
        }

        return await this.sender({
            method: method,
            url: url,
            headers: updatedHeaders,
            data: serializedData,
            transformRequest: [],
            validateStatus: () => true,
            responseType: 'arraybuffer',
            signal: newABortController.signal
        });
    }

    private setup_handlers() {
        // handle set request
        // ipcMain.handle("repeater:set-request", (_event, request: IRequest) => {
        //     this.checkOrAbortActiveRequest()

        //     this.captured_request = request;
        // })

        // send captured request
        ipcMain.handle("repeater:send-request", async (_event, capturedRequest: IRequest) => {
            if (!capturedRequest) {
                return {
                    success: false,
                    message: "No Request Set"
                }
            }

            let response: IRepeaterResponse | null = null;

            try {
                const res = await this.sendCapturedRequest(capturedRequest);
                const responseBodyBuffer = Buffer.from(res.data);
                const parsedBody = Parser.parseResponseBufferAsText(responseBodyBuffer, (res.headers["content-type"]??"").toString().toLowerCase())

                response = {
                    error: null,
                    data: {
                        id: capturedRequest.id,
                        statusCode: res.status,
                        body: parsedBody,
                        headers: res.headers
                    }
                }
            } catch (error) {
                response = {
                    error: error,
                    data: null
                }
            }

            this.webContents.send("repeater:response", response);
        })
    }
}
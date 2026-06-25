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

        let serializedData: string | Buffer = "";
        const bodyType = Parser.getRequestType(headers);

        if (body && body !== "Error parsing body content") {
            try {
                if (bodyType === 'json') {
                    // Step back from standard stringified JSON layout to compressed layout
                    const parsed = JSON.parse(body);
                    serializedData = JSON.stringify(parsed);
                } 
                else if (bodyType === 'form') {
                    // Step back from the pretty-printed JSON parameter object string
                    const jsonObject = JSON.parse(body);
                    const urlParams = new URLSearchParams();

                    for (const [key, value] of Object.entries(jsonObject)) {
                        if (typeof value === 'object' && value !== null) {
                            // Recovers any hybrid nested stringified-JSON payloads
                            urlParams.append(key, JSON.stringify(value));
                        } else {
                            urlParams.append(key, String(value));
                        }
                    }
                    serializedData = urlParams.toString(); // Outputs: "key1=val1&key2=val2"
                } else if (bodyType === 'multipart' || bodyType === 'raw') {
                    serializedData = Buffer.from(body, 'base64');
                }
                else {
                    // For text or unhandled/raw variants, pipe the raw string directly
                    serializedData = body;
                }
            } catch (e) {
                // Fallback fallback: If structural serialization fails (invalid JSON edits),
                // forward the user's raw input directly so the server can handle validation errors.
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
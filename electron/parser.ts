import { RequestBody } from "@/interfaces/logInterfaces";
import * as mockttp from "mockttp"

export class Parser {
    static getRequestType (headers: mockttp.Headers): RequestBody  {
        const contentType = headers['content-type'] || '';
        
        if (contentType.includes('application/json')) return 'json';
        if (contentType.includes('application/x-www-form-urlencoded')) return 'form';
        if (contentType.includes('multipart/form-data')) return 'multipart';
        if (contentType.includes('text/')) return 'text';
        
        return 'raw';
    };
    
    static async parseBodyAsText(headers: mockttp.Headers, body: mockttp.CompletedBody): Promise<string> {
        const bodyType = this.getRequestType(headers);
        let parsedBody: any = null;
        
        try {
            if (bodyType === 'json') {
                const rawJson = await body.getJson();
                parsedBody = JSON.stringify(rawJson);
            } else if (bodyType === 'form') {
                // Form data comes as "key1=val1&key2=val2"
                const rawForm = await body.getText();
                const params = Object.fromEntries(new URLSearchParams(rawForm));
                parsedBody = JSON.stringify(params, null, 2)
            } else {
                const decodedBuf = await body.getDecodedBuffer();
                parsedBody = decodedBuf?.toString('base64') ?? "";
            }
        } catch (e) {
            parsedBody = "Error parsing body content";
        }

        return parsedBody
    }

    static parseResponseBufferAsText(buffer: Buffer<any>, contentType: string): string {
        let formattedBody: string;

        if (
            contentType.includes('json') || 
            contentType.includes('text/') || 
            contentType.includes('xml') || 
            contentType.includes('javascript') ||
            contentType.includes('x-www-form-urlencoded')
        ) {
            // It's a text-based format, safely encode the bytes to a string
            formattedBody = buffer.toString('utf-8');
            
            // Optional: If it's JSON, you can run it through JSON.stringify(JSON.parse(formattedBody), null, 2) here to pretty-print it for your editor box!
        } else {
            // It's a true binary file (image, zip, etc.). Show a placeholder or hex representation in your UI textbox
            formattedBody = `[Binary Data: ${contentType} - ${buffer.length} bytes]`;
        }

        return formattedBody;
    }

    static serializeBody(body: string, contentType: string): string | Buffer<any> {
        let serializedData: string | Buffer<any>;

        if (contentType === 'json') {
            // Step back from standard stringified JSON layout to compressed layout
            const parsed = JSON.parse(body);
            serializedData = JSON.stringify(parsed);
        } 
        else if (contentType === 'form') {
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
        } else if (contentType === 'multipart' || contentType === 'raw') {
            serializedData = Buffer.from(body, 'base64');
        }
        else {
            // For text or unhandled/raw variants, pipe the raw string directly
            serializedData = body;
        }

        return serializedData;
    }
}
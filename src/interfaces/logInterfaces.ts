// import * as mockttp from "mockttp";

export interface IRequest {
    id: string,
    method: string,
    body: any,
    headers: Record<string, any>,
    url: string,
    path: string,
    http: string
    destination: string
}

export interface IResponse {
    id: string,
    statusCode: number,
    body: any,
    headers: Record<string, any>
}
export type RequestBody = "json" | "form" | "multipart" | "text" | "raw";
export type IReqResolver = (action: "resume" | "drop") => void

export interface IPendingRequest {
    requestId: string
    data: IRequest
    resolver: IReqResolver
}

export interface NetworkLog {
    requestId: string
    response?: IResponse
    request: IRequest
}


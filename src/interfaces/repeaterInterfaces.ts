import { IRequest, IResponse } from "./logInterfaces";

export interface IRepeaterResponse {
    error: any,
    data: IResponse | null
}

export interface IRepeaterStore {
    isSendingRequest: boolean
    repeatRequest: IRequest | null,
    repeatResponse: IResponse | null,
    onSetRepeatRequest: (req: IRequest | null) => void;
    setIsSendingRequest: (isSending: boolean) => void;
    onRepeatResponse: (res: IResponse | null) => void;
    onRepeatRequestBodyChange: (body: string) => void;
    onRepeatRequestHeaderChange: (header: string, value: string) => void;
    onRepeatRequestHeaderRemove: (header: string) => void;
}
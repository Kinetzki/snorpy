import { IRequest, IResponse } from "./logInterfaces";

export interface IIntruderResponse {
    error: any | null,
    response: IResponse | null
    payload: string
    request: IRequest  
}

export interface IIntruderStore {
    isIntruderRunning: boolean
    concurrency: number
    onSetIntruderConcurrency: (concurrency: number) => void
    onStartIntruder: () => void
    onIntruderStopped: () => void
    intruderRequest: IRequest | null,
    intruderResponses: IIntruderResponse[]
    selectedIntruderResponse: IIntruderResponse | null
    intruderPayloads: string[]
    onSetIntruderRequest: (req: IRequest | null) => void
    onAddIntruderResponse: (res: IIntruderResponse) => void
    onClearIntruderResponses: () => void;
    onClearIntruderRequest: () => void;
    onSelectIntruderResponse: (res: IIntruderResponse | null) => void;
    onAddIntruderPayload: (payload: string | string[]) => void;
    onClearIntruderPayloads: () => void;
    onRemoveIntruderPayload: (payload: string) => void;
    onIntruderRequestBodyChange: (body: string) => void;
    onIntruderRequestHeaderChange: (header: string, value: string) => void;
    onIntruderRequestHeaderRemove: (header: string) => void;
}

export interface IIntruderRequest {
    request: IRequest
    payload: string
}
import { IRequest } from "./logInterfaces";

export interface IProxyStore {
    isProxyRunning: boolean
    isIntercepting: boolean
    proxyTarget: string
    proxyPort: number
    proxyCaCert: string | null
    interceptedRequests: IRequest[]
    onToggleProxy: (params: {isChecked: boolean, cert: string | null}) => void
    setProxyPort: (port: number) => void
    setProxyTarget: (domain: string) => void
    setIsIntercept: (isIntercept: boolean) => void;
    onNewInterceptedRequest: (req: IRequest) => void;
    onClearInterceptedRequest: (reqIds: string[]) => void;
}

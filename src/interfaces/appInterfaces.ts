import { IRequest, IResponse, NetworkLog } from "./logInterfaces";

export interface IAppStore {
    networkLogs: NetworkLog[]
    selectedNetworkLog: NetworkLog | null
    setSelectedNetworkLog: (log: NetworkLog | null) => void
    onNewRequest: (req: IRequest) => void
    onNewResponse: (res: IResponse) => void
    onClearNetworkLogs: () => void
}
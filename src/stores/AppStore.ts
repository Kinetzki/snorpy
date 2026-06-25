import { IAppStore } from "@/interfaces/appInterfaces";
import { NetworkLog } from "@/interfaces/logInterfaces";
import { create } from "zustand";

export const useAppStore = create<IAppStore>((set) => ({
    networkLogs: [],
    selectedNetworkLog: null,
    setSelectedNetworkLog: (log) => set({
        selectedNetworkLog: log
    }),
    onNewRequest: (req) => set((state) => {
        const newNetworkLog: NetworkLog = {
            requestId: req.id,
            request: {...req}
        }

        return {
            networkLogs: [newNetworkLog, ...state.networkLogs].slice(0, 500)
        }
    }),
    onNewResponse: (res) => set((state) => {
        const updatedLogs = state.networkLogs.map(el => {
            if (el.requestId === res.id) {
                return {
                    ...el,
                    response: res
                }
            }
            return el
        })

        return {
            networkLogs: [...updatedLogs]
        }
    }),
    onClearNetworkLogs: () => set({
        networkLogs: []
    })
}))
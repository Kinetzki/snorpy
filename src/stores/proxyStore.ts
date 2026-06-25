import { IProxyStore } from "@/interfaces/proxyInterfaces";
import { create } from "zustand";

export const useProxyStore = create<IProxyStore>((set) => ({
    isProxyRunning: false,
    isIntercepting: false,
    proxyTarget: "*",
    proxyPort: 8080,
    proxyCaCert: null,
    interceptedRequests: [],
    onToggleProxy: ({ isChecked, cert}) => set({
        isProxyRunning: isChecked,
        proxyCaCert: cert
    }),
    setProxyPort: (port) => set({
        proxyPort: port
    }),
    setProxyTarget: (domain) => set({
        proxyTarget: domain
    }),
    setIsIntercept: (isIntercept) => set({
        isIntercepting: isIntercept
    }),
    onNewInterceptedRequest: (req) => set((state) => {
        return {
            interceptedRequests: [req, ...state.interceptedRequests].slice(0, 500)
        }
    }),
    onClearInterceptedRequest: (reqIds) => set((state) => {
        const currReqs = [...state.interceptedRequests];
        const filteredReqs = currReqs.filter(el => !reqIds.includes(el.id));

        return {
            interceptedRequests: [...filteredReqs]
        }
    })
}))
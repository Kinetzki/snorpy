import { IIntruderStore } from "@/interfaces/intruderInterfaces";
import { create } from "zustand";

const useIntruderStore = create<IIntruderStore>((set) => ({
    isIntruderRunning: false,
    intruderRequest: null,
    intruderResponses: [],
    selectedIntruderResponse: null,
    intruderPayloads: [],
    onStartIntruder: () => set({
        isIntruderRunning: true
    }),
    onIntruderStopped: () => set({
        isIntruderRunning: false
    }),
    onSetIntruderRequest: (req) => set({
        intruderRequest: req
    }),
    onAddIntruderResponse: (res) => set((state) => {
        return {
            intruderResponses: [...state.intruderResponses, res]
        }
    }),
    onClearIntruderResponses: () => set({
        intruderResponses: []
    }),
    onClearIntruderRequest: () => set({
        intruderRequest: null
    }),
    onSelectIntruderResponse: (res) => set({
        selectedIntruderResponse: res
    }),
    onAddIntruderPayload: (payload) => set((state) => {
        const newPayloads = Array.isArray(payload) ? payload : [payload];
        return {
            intruderPayloads: [...state.intruderPayloads, ...newPayloads]
        }
    }),
    onClearIntruderPayloads: () => set({
        intruderPayloads: []
    }),
    onRemoveIntruderPayload: (payload) => set((state) => {
        return {
            intruderPayloads: state.intruderPayloads.filter(p => p !== payload)
        }
    }),
    onIntruderRequestBodyChange: (body) => set((state) => {
        if (!state.intruderRequest) return {
            ...state
        };

        const newReq = {
            ...state.intruderRequest,
            body: body
        }
        
        return {
            intruderRequest: newReq
        }
    }),
    onIntruderRequestHeaderChange: (header, value) => set((state) => {
        if (!state.intruderRequest) return {
            ...state
        };

        const newReq = {
            ...state.intruderRequest,
            headers: {
                ...state.intruderRequest.headers,
                [header]: value
            }
        }

        return {
            intruderRequest: newReq
        }
    }),
    onIntruderRequestHeaderRemove: (header) => set((state) => {
        if (!state.intruderRequest) return {
            ...state
        };

        const newHeaders = { ...state.intruderRequest.headers };
        delete newHeaders[header];

        return {
            intruderRequest: {
                ...state.intruderRequest,
                headers: newHeaders
            }
        };
    })
}))

export default useIntruderStore;
import { IRepeaterStore } from "@/interfaces/repeaterInterfaces";
import { create } from "zustand";

export const useRepeaterStore = create<IRepeaterStore>((set) => ({
    isSendingRequest: false,
    repeatRequest: null,
    repeatResponse: null,
    setIsSendingRequest: (isSending) => set({
        isSendingRequest: isSending
    }),
    onSetRepeatRequest: (req) => set({
        repeatRequest: req,
        repeatResponse: null
    }),
    onRepeatResponse: (res) => set({
        isSendingRequest: false,
        repeatResponse: res
    }),
    onRepeatRequestBodyChange: (body) => set((state) => {
        if (!state.repeatRequest) return {
            ...state
        };

        const newReq = {
            ...state.repeatRequest,
            body: body
        }

        return {
            repeatRequest: newReq
        }
    }),
    onRepeatRequestHeaderChange: (header, value) => set((state) => {
        if (!state.repeatRequest) return {
            ...state
        };

        const newReq = {
            ...state.repeatRequest,
            headers: {
                ...state.repeatRequest.headers,
                [header]: value
            }
        }

        return {
            repeatRequest: newReq
        }
    }),
    onRepeatRequestHeaderRemove: (header) => set((state) => {
        if (!state.repeatRequest) return {
            ...state
        };

        const newHeaders = { ...state.repeatRequest.headers };
        delete newHeaders[header];

        return {
            repeatRequest: {
                ...state.repeatRequest,
                headers: newHeaders
            }
        };
    })
}))
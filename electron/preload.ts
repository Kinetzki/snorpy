import { IRequest } from '@/interfaces/logInterfaces';
import { ipcRenderer, contextBridge } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args
    return ipcRenderer.off(channel, ...omit)
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args
    return ipcRenderer.send(channel, ...omit)
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args
    return ipcRenderer.invoke(channel, ...omit)
  },

  // You can expose other APTs you need here.
  // ...
})

// Custom snorpy API
contextBridge.exposeInMainWorld("snorpy", {
  start: () => ipcRenderer.invoke("proxy:start"),
  stop: () => ipcRenderer.invoke("proxy:stop"),
  resume: (id: string) => ipcRenderer.invoke("proxy:resume-request", id),
  setPort: (port: number) => ipcRenderer.invoke("proxy:set-port", port),
  setIntercept: (isIntercept: boolean) => ipcRenderer.invoke("proxy:set-intercept", isIntercept),
  setTarget: (domain: string) => ipcRenderer.invoke("proxy:set-target", domain),
  onRequestIntercepted: (callback: any) => {
    ipcRenderer.on("proxy:request-intercepted", (_event, data) => callback(data))
  },
  onRequestPassthrough: (callback: any) => {
    ipcRenderer.on("proxy:request-passthrough", (_event, data) => callback(data))
  },
  onResponseIntercepted: (callback: any) => {
    ipcRenderer.on("proxy:response-intercepted", (_event, data) => callback(data))
  },
  onClearPendingRequests: (callback:any) => {
    ipcRenderer.on("proxy:requests-cleared", (_event, data) => callback(data))
  },
  repeatRequest: (req: IRequest) => ipcRenderer.invoke("repeater:send-request", req),
  onRepeatResponse: (callback: any) => {
    ipcRenderer.on("repeater:response", (_event, data) => callback(data))
  }
})
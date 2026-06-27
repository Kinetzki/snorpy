"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("snorpy", {
  start: () => electron.ipcRenderer.invoke("proxy:start"),
  stop: () => electron.ipcRenderer.invoke("proxy:stop"),
  resume: (id) => electron.ipcRenderer.invoke("proxy:resume-request", id),
  dropRequest: (id) => electron.ipcRenderer.invoke("proxy:drop-request", id),
  setPort: (port) => electron.ipcRenderer.invoke("proxy:set-port", port),
  setIntercept: (isIntercept) => electron.ipcRenderer.invoke("proxy:set-intercept", isIntercept),
  setTarget: (domain) => electron.ipcRenderer.invoke("proxy:set-target", domain),
  onRequestIntercepted: (callback) => {
    electron.ipcRenderer.on("proxy:request-intercepted", (_event, data) => callback(data));
  },
  onRequestPassthrough: (callback) => {
    electron.ipcRenderer.on("proxy:request-passthrough", (_event, data) => callback(data));
  },
  onResponseIntercepted: (callback) => {
    electron.ipcRenderer.on("proxy:response-intercepted", (_event, data) => callback(data));
  },
  onClearPendingRequests: (callback) => {
    electron.ipcRenderer.on("proxy:requests-cleared", (_event, data) => callback(data));
  },
  repeatRequest: (req) => electron.ipcRenderer.invoke("repeater:send-request", req),
  onRepeatResponse: (callback) => {
    electron.ipcRenderer.on("repeater:response", (_event, data) => callback(data));
  },
  startIntruder: (req, payloads, concurrency) => electron.ipcRenderer.invoke("intruder:start", { request: req, payloads, concurrency }),
  stopIntruder: () => electron.ipcRenderer.invoke("intruder:stop"),
  onIntruderResponse: (callback) => {
    electron.ipcRenderer.on("intruder:response", (_event, data) => callback(data));
  }
});

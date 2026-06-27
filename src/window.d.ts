import { IRequest, IResponse } from "./interfaces/logInterfaces";
import { IRepeaterResponse } from "./interfaces/repeaterInterfaces";

export interface ISnorpyApi {
  start: () => Promise<{ success: boolean; url: string; cert: string }>;
  stop: () => Promise<{ success: boolean; url: string }>;
  resume: (id: string) => Promise<void>;
  dropRequest: (id: string) => Promise<void>;
  setPort: (port: number) => void;
  setTarget: (domain: string) => void;
  setIntercept: (isIntercept: boolean) => void;
  onRequestIntercepted: (callback: (data: IRequest) => void) => void;
  onRequestPassthrough: (callback: (data: IRequest) => void) => void;
  onResponseIntercepted: (callback: (data: IResponse) => void) => void;
  onClearPendingRequests: (callback: (data: string[]) => void) => void;
  repeatRequest: (req: IRequest) => void;
  onRepeatResponse: (callback: (data: IRepeaterResponse) => void) => void;
}

declare global {
  interface Window {
    snorpy: ISnorpyApi;
  }
}
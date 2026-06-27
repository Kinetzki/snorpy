import { TooltipProvider } from "./components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import Proxy from "./components/proxy/Proxy";
import { useEffect } from "react";
import { IRequest, IResponse } from "./interfaces/logInterfaces";
import { useAppStore } from "./stores/AppStore";
import Sidebar from "./components/sidebar/Sidebar";
import { useProxyStore } from "./stores/proxyStore";
import Tools from "./components/tools/Tools";
import { useRepeaterStore } from "./stores/RepeaterStore";
import { IRepeaterResponse } from "./interfaces/repeaterInterfaces";
import { toast } from "sonner";
import { IIntruderResponse } from "./interfaces/intruderInterfaces";
import useIntruderStore from "./stores/IntruderStore";

const App = () => {
    const { onNewRequest, onNewResponse } = useAppStore();
    const { onNewInterceptedRequest, onClearInterceptedRequest } = useProxyStore();
    const { onRepeatResponse } = useRepeaterStore();
    const { onAddIntruderResponse } = useIntruderStore();

    const handlePassthroughRequest = (log: IRequest) => {
        onNewRequest(log);
    };

    const handleResponse = (log: IResponse) => {
        onNewResponse(log);
    };

    const handleInterceptedRequest = (log: IRequest) => {
        onNewInterceptedRequest(log)
    }

    const handleClearPendingRequests = (requestIds: string[]) => {
        onClearInterceptedRequest(requestIds);
    }

    const handleRepeatResponse = (res: IRepeaterResponse) => {
        console.log(res)
        if (res.error) {
            toast.error("Failed to send Request")
            return;
        }
        onRepeatResponse(res.data)
    }

    const handleIntruderResponse = (res: IIntruderResponse) => {
        console.log("Intruder Response", res)
        if (res.error) {
            toast.error(`Request failed: ${String(res.error)}`)
        }
        onAddIntruderResponse(res)
    }

    useEffect(() => {
        window.snorpy.onRequestPassthrough(handlePassthroughRequest);
        window.snorpy.onResponseIntercepted(handleResponse);
        window.snorpy.onRequestIntercepted(handleInterceptedRequest);
        window.snorpy.onClearPendingRequests(handleClearPendingRequests);
        window.snorpy.onRepeatResponse(handleRepeatResponse)
        window.snorpy.onIntruderResponse(handleIntruderResponse)
    }, []);

    return (
        <TooltipProvider>
            <main className="max-w-screen max-h-screen min-w-screen min-h-screen bg-background text-foreground overflow-hidden grid grid-cols-[300px_auto]">
                <Sidebar/>
                <div className="w-full min-h-full">
                    <Routes>
                        <Route path="/proxy/*" element={<Proxy />} />
                        <Route path="/tools/*" element={<Tools />} />
                    </Routes>
                </div>
            </main>
        </TooltipProvider>
    );
};

export default App;

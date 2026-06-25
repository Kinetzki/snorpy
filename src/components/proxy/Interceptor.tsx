import { defaultStyle, methodStyles } from "@/lib/utils";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { useProxyStore } from "@/stores/proxyStore";
import { Badge } from "../ui/badge";
import { SkipForward, Trash } from "lucide-react";
import { Button } from "../ui/button";

const Interceptor = () => {
    const { isIntercepting, setIsIntercept, interceptedRequests } = useProxyStore();

    const onInterceptChange = (checked: boolean) => {
        window.snorpy.setIntercept(checked);
        setIsIntercept(checked);
    };

    const onForwardrequest = (requestId: string) => {
        window.snorpy.resume(requestId);
    }

    return (
        <div className="max-h-full h-full w-full grid grid-rows-[50px_auto]">
            <div className="bg-secondary/50 flex items-center px-6">
                <section className="flex items-center justify-between w-50">
                    <Label htmlFor="proxy-status" className="text-md">
                        Intercept Requests
                    </Label>
                    <span className="flex items-center">
                        <Switch
                            id="intercept-status"
                            onCheckedChange={onInterceptChange}
                            checked={isIntercepting}
                        />
                    </span>
                </section>
            </div>

            <div className="max-h-full min-h-0 h-full w-full grid grid-rows-[50px_auto]">
                <div className="flex items-center bg-secondary/60 border-b border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 select-none shadow-[0_1px_0_0_rgba(255,255,255,0.02)] font-semibold">
                    <div className="w-24 shrink-0">Method</div>
                    <div className="w-72 shrink-0">Content Type</div>
                    <div className="w-64 shrink-0">Destination</div>
                    <div className="flex-1">Path</div>
                </div>

                <div className="flex-1 min-h-0 max-w-[90vw] h-full w-full flex flex-col border-t overflow-auto">
                    <section className="flex flex-col">
                        {interceptedRequests.map(request => {
                            const customBadgeClass = methodStyles[request.method] || defaultStyle;

                            return (
                                <div 
                                    data-hovering="false"
                                    className="group flex h-14 items-center border-b border-zinc-900 px-4 hover:bg-zinc-900/30 text-xs text-zinc-300 transition-colors cursor-pointer p-3"
                                    onMouseEnter={(e) => {
                                        const currAttribute = e.currentTarget.getAttribute('data-hovering')
                                        e.currentTarget.setAttribute("data-hovering", currAttribute  === 'true' ? 'false' : 'true')
                                    }}
                                    onMouseLeave={(e) => {
                                        const currAttribute = e.currentTarget.getAttribute('data-hovering')
                                        e.currentTarget.setAttribute("data-hovering", currAttribute  === 'true' ? 'false' : 'true')
                                    }}
                                >
                                    <div className="w-24 shrink-0 flex items-center">
                                        <Badge
                                            variant="outline"
                                            className={`tracking-wide font-bold px-2 py-0.5 rounded ${customBadgeClass}`}
                                        >
                                            {request.method}
                                        </Badge>
                                    </div>
                                    <div className="w-72 shrink-0 flex items-center">
                                        <Badge
                                            variant="outline"
                                            className={`tracking-wide font-bold px-2 py-0.5 rounded`}
                                        >
                                            {request.headers["content-type"]??"--"}
                                        </Badge>
                                    </div>
                                    <div className="w-64 shrink-0 truncate pr-4 text-zinc-400">
                                        {request.destination}
                                    </div>
                                    <div className="flex-1 text-zinc-200 relative h-full">
                                        <p className="max-w-lg truncate">{request.path}</p>
                                        <section className="absolute right-0 top-0 h-full group-data-[hovering=false]:hidden">
                                            <Button variant={"ghost"} onClick={() => {
                                                onForwardrequest(request.id);
                                            }}>
                                                <SkipForward />
                                            </Button>
                                            <Button variant={"ghost"}>
                                                <Trash />
                                            </Button>
                                        </section>
                                    </div>
                                </div>
                            )
                        })}
                    </section>
                    
                </div>
            </div>
        </div>
    );
};

export default Interceptor;

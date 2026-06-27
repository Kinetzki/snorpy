import RequestViewer from '@/components/log/RequestViewer';
import ResponseViewer from '@/components/log/ResponseViewer';
import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';
import { defaultStyle, getStatusStyle, methodStyles } from '@/lib/utils';
import { useRepeaterStore } from '@/stores/RepeaterStore';
import { LoaderCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const Repeater = () => {
    const { repeatRequest, repeatResponse, onRepeatRequestBodyChange, isSendingRequest, setIsSendingRequest, onSetRepeatRequest, onRepeatRequestHeaderChange, onRepeatRequestHeaderRemove } = useRepeaterStore();

    const onSendRequest = () => {
        if (!repeatRequest) return;
        setIsSendingRequest(true);
        window.snorpy.repeatRequest(repeatRequest);
        toast.success("Request sent to repeater!")
    }

    const onBodyChange = (body: string | undefined) => {
        if (!body) return;
        onRepeatRequestBodyChange(body)
    }

    const onHeaderValueChange = (header: string, value: string) => {
        if (!header || !value) return;
        onRepeatRequestHeaderChange(header, value)
    }

    const onHeaderRemove = (header: string) => {
        if (!header) return;
        onRepeatRequestHeaderRemove(header)
    }

    const onClearRepeatRequest = () => {
        onSetRepeatRequest(null)
    }

  return (
    <div className="w-full h-full grid grid-rows-[50px_50px_auto]">
        <section className="bg-card/70 flex items-center px-6 border-b">
            <h1 className="font-semibold text-zinc-200">Repeater</h1>
        </section>

        <section className="bg-secondary/50 flex items-center px-6 justify-end border-b gap-2">
            <Button className="min-w-30" disabled={!!!repeatRequest} onClick={onSendRequest}>Send</Button>
            <Button className="min-w-30 text-red-500 hover:text-red-600" variant="destructive" onClick={onClearRepeatRequest}>
                <Trash2 className="w-4 h-4" />
                Clear Request
            </Button>
        </section>

        {/* <NetworkLogViewer log={}/> */}
        <div className="flex items-center min-h-full pb-4">
            <div className="max-w-[50%] flex-1 border-r h-full min-h-0 flex-col flex">
                <section className="w-full bg-card/50 p-2 border-b items-center flex gap-4">
                    <h1 className="">Request</h1>
                    {
                        repeatRequest && (
                            <Badge
                                variant="outline"
                                className={`tracking-wide font-bold rounded ${methodStyles[repeatRequest?.method??""] || defaultStyle}`}
                            >
                                {repeatRequest?.method}
                            </Badge>
                        )
                    }
                </section>
                
                {repeatRequest ? (
                    <section className="w-full h-full px-6 py-1 min-h-0">
                        <RequestViewer 
                            request={repeatRequest} 
                            allowEdit 
                            onBodyChange={onBodyChange} 
                            onHeaderValueChange={onHeaderValueChange} 
                            onHeaderRemove={onHeaderRemove}
                        />
                    </section>
                ) : (
                    <section className="flex w-full h-full items-center justify-center font-semibold text-zinc-200">
                        <h1>No Selected Request</h1>
                    </section>
                )}
            </div>
            <div className="max-w-[50%] flex-1 border-r h-full min-h-0 flex-col flex">
                <section className="w-full bg-card/50 p-2 border-b items-center flex gap-4">
                    <h1 className="">Response</h1>
                    {
                        repeatResponse && (
                            <section className="items-center flex gap-1">
                                <Badge
                                    variant="outline"
                                    className={`tracking-wide font-bold px-2 py-0.5 rounded ${getStatusStyle(repeatResponse?.statusCode??0)}`}
                                >
                                    {repeatResponse?.statusCode || "Pending"}
                                </Badge>
                            </section>
                        )
                    }
                    {isSendingRequest && (
                        <LoaderCircle className="animate-spin"/>
                    )}
                </section>
                {repeatResponse ? (
                    <section className="w-full h-full px-6 py-1 min-h-0">
                        <ResponseViewer response={repeatResponse}/>
                    </section>
                ) : (
                    <section className="flex w-full h-full items-center justify-center font-semibold text-zinc-200">
                        <h1>No Response</h1>
                    </section>
                )}
            </div>
        </div>
        
    </div>
  )
}

export default Repeater

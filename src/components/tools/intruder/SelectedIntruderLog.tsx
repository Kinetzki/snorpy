import NetworkLogViewer from '@/components/log/NetworkLogViewer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NetworkLog } from '@/interfaces/logInterfaces';
import { defaultStyle, getStatusStyle, methodStyles } from '@/lib/utils';
import useIntruderStore from '@/stores/IntruderStore';
import { EllipsisVertical } from 'lucide-react';
import { useRepeaterStore } from '@/stores/RepeaterStore';
import { toast } from 'sonner';

const SelectedIntruderLog = () => {
    const { selectedIntruderResponse, onSelectIntruderResponse } = useIntruderStore();
    const { response, request } = selectedIntruderResponse || {};
    const { onSetRepeatRequest } = useRepeaterStore();

    const onClose = () => {
        onSelectIntruderResponse(null);
    }
    
    const onSendToRepeater = () => {
        if (!selectedIntruderResponse) return;
        onSetRepeatRequest(selectedIntruderResponse.request)
        toast.success("Request sent to repeater")
    }

    return (
        <Dialog open={!!selectedIntruderResponse} onOpenChange={onClose}>
                <DialogContent className="min-w-200 min-h-58 max-w-200 h-[80vh] flex flex-col justify-between">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-4">
                            <section className="items-center flex gap-1">
                                <Badge
                                    variant="outline"
                                    className={`tracking-wide font-bold px-2 py-0.5 rounded ${getStatusStyle(response?.statusCode??0)}`}
                                >
                                    {response?.statusCode || "Pending"}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={`tracking-wide font-bold rounded ${methodStyles[request?.method??""] || defaultStyle}`}
                                >
                                    {request?.method}
                                </Badge>
                                
                            </section>
                            <h1 className="py-2 px-4 bg-secondary border rounded-lg">{`Network Log - ${request?.destination}`}</h1>
                        </DialogTitle>
                    </DialogHeader>
                    {!!selectedIntruderResponse && (
                        <NetworkLogViewer log={{
                            request: selectedIntruderResponse.request,
                            response: selectedIntruderResponse.response,
                            requestId: selectedIntruderResponse.request.id
                        } as NetworkLog} />
                    )}

                    <DialogFooter className="h-fit flex">
                        <DialogClose asChild>
                            <Button type="button">Close</Button>
                        </DialogClose>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant={"outline"}>
                                    <EllipsisVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40 font-semibold" align="start">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Tools</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                        className="px-2 py-2 cursor-pointer text-zinc-300"
                                        onClick={onSendToRepeater}
                                    >Send to repeater</DropdownMenuItem>
                                    <DropdownMenuItem className="px-2 py-2 cursor-pointer text-zinc-300">Send to decoder</DropdownMenuItem>
                                    <DropdownMenuItem className="px-2 py-2 cursor-pointer text-zinc-300">Send to buster</DropdownMenuItem>
                                    <DropdownMenuItem className="px-2 py-2 cursor-pointer text-zinc-300">Send to analyzer</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
    )
}

export default SelectedIntruderLog

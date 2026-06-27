import React, { useEffect, useState } from 'react'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { useAppStore } from '@/stores/AppStore';
import { Button } from '../ui/button';
import NetworkLogViewer from '../log/NetworkLogViewer';
import { IRequest, IResponse } from '@/interfaces/logInterfaces';
import { Badge } from '../ui/badge';
import { defaultStyle, getStatusStyle, methodStyles } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { useRepeaterStore } from '@/stores/RepeaterStore';
import { toast } from 'sonner';
import useIntruderStore from '@/stores/IntruderStore';

const SelectedLogDialog:React.FC = () => {
    const { selectedNetworkLog, setSelectedNetworkLog } = useAppStore();
    const { onSetRepeatRequest } = useRepeaterStore();
    const { onSetIntruderRequest } = useIntruderStore();
    const [ logRequest, setLogRequest ] = useState<IRequest | null>(null);
    const [ logResponse, setLogResponse ] = useState<IResponse | null>(null);

    const onClose = () => {
        setSelectedNetworkLog(null)
    }

    const onSendToRepeater = () => {
        if (!selectedNetworkLog) return;
        onSetRepeatRequest(selectedNetworkLog.request)
        toast.success("Request sent to repeater")
    }

    const onSendToIntruder = () => {
        if (!selectedNetworkLog) return;
        onSetIntruderRequest(selectedNetworkLog.request)
        toast.success("Request sent to intruder")
    }

    useEffect(() => {
        if (selectedNetworkLog) {
            const { request, response } = {...selectedNetworkLog};

            setLogRequest(request)
            setLogResponse(response || null)
        }
    }, [selectedNetworkLog])

    return (
        <Dialog open={!!selectedNetworkLog} onOpenChange={onClose}>
            <DialogContent className="min-w-200 min-h-58 max-w-200 h-[80vh] flex flex-col justify-between">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-4">
                        <section className="items-center flex gap-1">
                            <Badge
                                variant="outline"
                                className={`tracking-wide font-bold px-2 py-0.5 rounded ${getStatusStyle(logResponse?.statusCode??0)}`}
                            >
                                {logResponse?.statusCode || "Pending"}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={`tracking-wide font-bold rounded ${methodStyles[logRequest?.method??""] || defaultStyle}`}
                            >
                                {logRequest?.method}
                            </Badge>
                            
                        </section>
                        <h1 className="py-2 px-4 bg-secondary border rounded-lg">{`Network Log - ${logRequest?.destination}`}</h1>
                    </DialogTitle>
                </DialogHeader>
                {selectedNetworkLog && (
                    <NetworkLogViewer log={selectedNetworkLog} />
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
                                <DropdownMenuItem 
                                    className="px-2 py-2 cursor-pointer text-zinc-300"
                                    onClick={onSendToIntruder}
                                >Send to intruder</DropdownMenuItem>
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

export default SelectedLogDialog

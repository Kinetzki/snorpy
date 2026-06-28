import { getStatusStyle, methodStyles } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { useAppStore } from "@/stores/AppStore";
import { NetworkLog } from "@/interfaces/logInterfaces";
import SelectedLogDialog from "./SelectedLogDialog";
import { Trash2 } from "lucide-react";
import { type RowComponentProps, List } from 'react-window';
import { Button } from "../ui/button";

const defaultStyle = "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";

interface LogData {
    items: NetworkLog[]
    onSelect: (log: NetworkLog) => void
}

const Log = ({index, style, ariaAttributes, items, onSelect}: RowComponentProps<LogData>) => {
    const log = items[index];
    const { request, response } = log;
    const statusCode = response?.statusCode ?? 0;
    const customBadgeClass =
        methodStyles[request.method] || defaultStyle;
    const statusBadgeClass = getStatusStyle(statusCode);

    return (
        <div 
            style={style}
            {...ariaAttributes}
            className="flex items-center border-b border-zinc-900 px-4 hover:bg-zinc-900/30 text-xs text-zinc-300 transition-colors cursor-pointer p-3" onClick={() => onSelect(log)}>
            <div className="w-24 shrink-0 flex items-center">
                <Badge
                    variant="outline"
                    className={`tracking-wide font-bold px-2 py-0.5 rounded ${customBadgeClass}`}
                >
                    {request.method}
                </Badge>
            </div>
            <div className="w-28 shrink-0 flex items-center">
                <Badge
                    variant="outline"
                    className={`tracking-wide font-bold px-2 py-0.5 rounded ${statusBadgeClass}`}
                >
                    {statusCode || "Pending"}
                </Badge>
            </div>
            <div className="w-42 shrink-0 flex items-center">
                <Badge
                    variant="ghost"
                    className={`tracking-wide font-bold px-2 py-0.5 rounded`}
                >
                    {response?.headers["content-length"] || "--"}
                </Badge>
            </div>
            <div className="w-64 shrink-0 truncate pr-4 text-zinc-400">
                {request.destination}
            </div>
            <div className="flex-1 max-w-lg truncate text-zinc-200">
                {request.path}
            </div>
        </div>
    )
}

const Logs = () => {
    const { networkLogs, setSelectedNetworkLog, onClearNetworkLogs } = useAppStore();

    const onLogSelection = (log: NetworkLog) => {
        console.log(log)
        setSelectedNetworkLog(log)
    }

    return (
        <>
            <SelectedLogDialog />
            <div className="max-h-full h-full w-full grid grid-rows-[50px_auto]"> 
                <div className="flex items-center bg-secondary/60 border-b border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 select-none shadow-[0_1px_0_0_rgba(255,255,255,0.02)] font-semibold">
                    <div className="w-24 shrink-0">Method</div>
                    <div className="w-28 shrink-0">Status</div>
                    <div className="w-42 shrink-0">Response Length</div>
                    <div className="w-64 shrink-0">Destination</div>
                    <div className="flex-1">Path</div>
                    <Button onClick={onClearNetworkLogs}>
                        <Trash2 size={16}/>
                        Clear Logs
                    </Button>
                </div>

                <div className="flex-1 min-h-0 max-w-[90vw] h-full w-full flex flex-col border-t  overflow-auto">
                    <List<LogData>
                        style={{ height: window.innerHeight - 150 , width: "100%"}}
                        rowCount={networkLogs.length}
                        rowHeight={56}
                        rowProps={{ items: networkLogs, onSelect: onLogSelection }}
                        rowComponent={Log}
                    />
                </div>
            </div>
        </>
        
    );
};

export default Logs;

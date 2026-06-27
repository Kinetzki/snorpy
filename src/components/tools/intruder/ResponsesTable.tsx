import useIntruderStore from '@/stores/IntruderStore'
import { Badge } from '@/components/ui/badge';
import { getStatusStyle } from '@/lib/utils';
// import { IIntruderResponse } from '@/interfaces/intruderInterfaces';
import SelectedIntruderLog from './SelectedIntruderLog';

// const sampleIntruderResponses: IIntruderResponse[] = [
//     {
//         error: null,
//         response: {
//             id: "1",
//             statusCode: 200,
//             headers: { "content-type": "text/html" },
//             body: "Hello, world!"
//         },
//         payload: "admin:password",
//         request: {
//             id: "1",
//             method: "GET",
//             url: "https://example.com",
//             body: "Hello, world!",
//             headers: { "content-type": "text/html" },
//             path: "/",
//             http: "http",
//             destination: "https://example.com"
//         }
//     }
// ];

const ResponsesTable = () => {
    const { intruderResponses, onSelectIntruderResponse } = useIntruderStore();

    return (
        <>
            <SelectedIntruderLog />
            {/* haeder with columns status, response length, destination, path */}
            <div className="max-h-full h-full w-full grid grid-rows-[50px_auto]">
                <div className="flex items-center bg-secondary/60 border-b border-zinc-800 px-4 py-2.5 text-sm text-zinc-400 select-none shadow-[0_1px_0_0_rgba(255,255,255,0.02)] font-semibold">
                    <div className="w-28 shrink-0">Status</div>
                    <div className="w-28 shrink-0">Payload</div>
                    <div className="w-42 shrink-0">Response Length</div>
                    <div className="w-64 shrink-0">Destination</div>
                    <div className="flex-1">Path</div>
                </div>
                <div className="flex-1 min-h-0 max-w-[90vw] h-full w-full flex flex-col border-t  overflow-auto">
                    {intruderResponses.map((intruderResponse) => {
                        const { response, payload, request } = intruderResponse;
                        const statusCode = response?.statusCode ?? 0;
                        const responseLength = response?.headers["content-length"] ?? 0;
                        const statusBadgeClass = getStatusStyle(statusCode);
                        const responseLengthBadgeClass = getStatusStyle(responseLength);
                        return (
                            <div 
                                className="flex items-center border-b border-zinc-900 px-4 hover:bg-zinc-900/30 text-xs text-zinc-300 transition-colors cursor-pointer p-3" 
                                onClick={() => onSelectIntruderResponse(intruderResponse)}
                                key={request.id}
                            >
                                <div className="w-28 shrink-0 flex items-center">
                                    <Badge variant="outline" className={`tracking-wide font-bold px-2 py-0.5 rounded ${statusBadgeClass}`}>
                                        {statusCode ?? "Pending"}
                                    </Badge>
                                </div>
                                <div className="w-28 shrink-0 flex items-center">
                                    <Badge variant="outline" className={`tracking-wide font-bold px-2 py-0.5 rounded ${statusBadgeClass}`}>
                                        {payload ?? "Pending"}
                                    </Badge>
                                </div>
                                <div className="w-42 shrink-0 flex items-center">
                                    <Badge variant="outline" className={`tracking-wide font-bold px-2 py-0.5 rounded ${responseLengthBadgeClass}`}>
                                        {responseLength ?? "Pending"}
                                    </Badge>
                                </div>
                                <div className="w-64 shrink-0 truncate pr-4 text-zinc-400">
                                    {request.destination}
                                </div>
                                <div className="flex-1 max-w-lg truncate text-zinc-200">
                                    {request.path}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default ResponsesTable;

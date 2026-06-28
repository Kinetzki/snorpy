import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ResponsesTable from './ResponsesTable'
import RequestViewer from '@/components/log/RequestViewer'
import useIntruderStore from '@/stores/IntruderStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { toast } from 'sonner'
import { useState } from 'react'

const Intruder = () => {
    const { intruderRequest, intruderPayloads, onAddIntruderPayload, onClearIntruderPayloads, onIntruderRequestBodyChange, onIntruderRequestHeaderChange, onIntruderRequestHeaderRemove, isIntruderRunning, onStartIntruder, onIntruderStopped, concurrency, onSetIntruderConcurrency } = useIntruderStore();
    const [ newPayload, setNewPayload ] = useState<string>("");

    const onNewPayloadChange = (payload: string) => {
        setNewPayload(payload);
    }

    const onPayloadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        // check if file is txt file then read lines and add to payloads
        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const payload = e.target?.result as string;
                onAddIntruderPayload(payload.split(/\r?\n/));
            }
            reader.readAsText(file);
        }
    }

    const onPayloadAdd = (payload: string) => {
        if (!payload) return;

        if (intruderPayloads.includes(payload)) {
            toast.error("Payload already exists");
            return;
        }

        onAddIntruderPayload(payload);
        setNewPayload("");
        toast.success("Payload added successfully");
    }

    const onPayloadClear = () => {
        onClearIntruderPayloads();
        toast.success("Payloads cleared successfully");
    }

    const onIntruderRequestHeaderValueChange = (header: string, value: string) => {
        if (!header) return;
        onIntruderRequestHeaderChange(header, value);
    }

    const onIntruderRequestHeaderValueRemove = (header: string) => {
        if (!header) return;
        onIntruderRequestHeaderRemove(header);
    }

    const onIntruderRequestBodyValueChange = (body: string) => {
        onIntruderRequestBodyChange(body);
    }

    const onIntruderStart = () => {
        if (!intruderRequest) return;
        if (intruderPayloads.length === 0) return;
        onStartIntruder();
        window.snorpy.startIntruder(intruderRequest, intruderPayloads, concurrency);
        toast.success("Intruder started successfully", { position: "top-center" });
    }

    const onStopIntruder = () => {
        onIntruderStopped();
        window.snorpy.stopIntruder();
        toast.success("Intruder stopped successfully", { position: "top-center" });
    }

    const onConcurrencyChange = (concurrency: string) => {
        onSetIntruderConcurrency(parseInt(concurrency));
    }

    return (
        <div className='w-full h-full grid grid-rows-[50px_1fr] min-h-0 grid-cols-[1fr_300px]'>
            <section className="bg-card/70 flex items-center px-6 border-b col-span-2">
                <h1 className="font-semibold text-zinc-200">Intruder</h1>
            </section>
            <section className='border-r p-2 h-full min-h-0'>
                {/* Tabs for Request, Response Table */}
                <Tabs defaultValue="request" className="h-full min-h-0">
                    <TabsList variant="line">
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="responses">Responses</TabsTrigger>
                    </TabsList>
                    <TabsContent value="request" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                        {!!intruderRequest ? (
                            <RequestViewer 
                                request={intruderRequest} 
                                allowEdit={true}
                                onBodyChange={(body) => onIntruderRequestBodyValueChange(body ?? "")} 
                                onHeaderValueChange={onIntruderRequestHeaderValueChange} 
                                onHeaderRemove={onIntruderRequestHeaderValueRemove} 
                                isHighlightPayloadPositions={true}
                            />
                        ) : (
                            <section className="flex w-full h-full items-center justify-center font-semibold text-zinc-200 min-h-0">
                                <h1>No Selected Request</h1>
                            </section>
                        )}
                    </TabsContent>
                    <TabsContent value="responses" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                        <ResponsesTable />
                    </TabsContent>
                </Tabs>
            </section>
            <section className='bg-secondary/50 grid grid-rows-[40px_100px_200px_1fr_50px] min-h-0 h-full w-full'>
                {/* Payload settings section, selecting of file or manual adding of payload*/}
                <h1 className="p-2 font-semibold text-zinc-200 border-b">Intruder Settings</h1>

                {/* File selection header and file selection input */}
                <section className="p-2 flex items-center gap-2 border-b">
                    <Field>
                        <FieldLabel>File Selection</FieldLabel>
                        <Input type="file" className="w-full" onChange={onPayloadFileChange} />
                    </Field>
                </section>

                {/* Manual payload input header and input */}
                <section className="p-2 flex flex-col items-center gap-2 border-b">
                    <Field>
                        <FieldLabel>Manual Payload</FieldLabel>
                        <Input 
                            type="text" 
                            value={newPayload} 
                            className="w-full" 
                            onChange={(e) => onNewPayloadChange(e.target.value)} 
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onPayloadAdd(newPayload);
                                }
                            }}
                        />
                        <FieldLabel>Concurrency</FieldLabel>
                        <Input 
                            type="number" 
                            value={concurrency} 
                            onChange={(e) => onConcurrencyChange(e.target.value)} 
                        />
                    </Field>
                    <section className="p-2 flex items-center gap-2 w-full justify-center">
                        <Button variant="default" onClick={() => onPayloadAdd(newPayload)}>Add Payload</Button>
                        <Button variant="default" onClick={() => onPayloadClear()}>Clear Payloads</Button>
                    </section>
                </section>
                
                {/* List rendering for all payloads in the store */}
                <section className="p-2 flex items-center gap-2 min-h-0 overflow-y-auto h-full w-full border-b py-4 ">
                    <section className="flex flex-col gap-2 min-h-0 h-full w-full rounded-md p-2">
                        {intruderPayloads.map((payload) => (
                            <p className="text-zinc-200 border-b" key={payload}>{payload}</p>
                        ))}
                    </section>
                </section>
                <section className="p-2 flex items-center gap-2 w-full justify-end">
                    {isIntruderRunning ? (
                        <Button variant="default" onClick={onStopIntruder}>Stop Intruder</Button>
                    ) : (
                        <Button variant="default" onClick={onIntruderStart}>Start Intruder</Button>
                    )}
                </section>
            </section>
        </div>
    )
}

export default Intruder

import { NetworkLog } from '@/interfaces/logInterfaces';
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import RequestViewer from './RequestViewer';
import ResponseViewer from './ResponseViewer';

interface NetworkLogViewerProps {
    log: NetworkLog
}

const NetworkLogViewer: React.FC<NetworkLogViewerProps> = ({ log }) => {
  return (
    <div className="w-full h-full min-h-0">
        <Tabs defaultValue="request" className="flex flex-col h-full">
            <TabsList variant={"line"}>
                <TabsTrigger value="request" aria-checked>Request</TabsTrigger>
                <TabsTrigger value="response" disabled={!!!log.response}>Response</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                <RequestViewer request={log.request} />
            </TabsContent>
            {
                !!log.response && (
                    <TabsContent value="response" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
                        <ResponseViewer response={log.response} />
                    </TabsContent>
                )
            }
        </Tabs>
    </div>
  )
}

export default NetworkLogViewer

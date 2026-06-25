import { IRequest } from '@/interfaces/logInterfaces';
import { type OnChange } from "@monaco-editor/react";
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import CodeEditor from '../editor/Editor';
import RequestHeader from './RequestHeader';

interface RequestViewerProps {
    request: IRequest,
    allowEdit?: boolean,
    onBodyChange?: OnChange;
}

const RequestViewer:React.FC<RequestViewerProps> = ({ request, allowEdit=false, onBodyChange }) => {

  const getMonacoLanguage = (contentTypeHeader: string | undefined) => {
    const contentType = (contentTypeHeader || '').toLowerCase();

    if (contentType.includes('application/json')) return 'json';
    
    // Since your backend parses form data into a pretty JSON string, 
    // Monaco should render it as JSON so the user can edit it like an object!
    if (contentType.includes('application/x-www-form-urlencoded')) return 'json';
    
    if (contentType.includes('text/html')) return 'html';
    if (contentType.includes('text/css')) return 'css';
    if (contentType.includes('javascript')) return 'javascript';
    if (contentType.includes('xml')) return 'xml';
    if (contentType.includes('graphql')) return 'graphql';

    // Fallback for raw binary, images, or plain text streams
    return 'plaintext';
  }

  return (
    <div className="w-full h-full min-h-0">
      <Tabs defaultValue="headers" className="flex flex-col h-full">
        <TabsList variant={"line"}>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="params">Params</TabsTrigger>
        </TabsList>
        <TabsContent value="headers" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
          <RequestHeader headers={request.headers} allowEdit={allowEdit} />
        </TabsContent>
        <TabsContent value="body" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
          {(allowEdit && !!onBodyChange) ? (
            <CodeEditor 
              height="100%"
              width="100%"
              language={getMonacoLanguage(request.headers["content-type"])}
              code={request.body} 
              readOnly={!allowEdit} 
              onChange={onBodyChange}
            />
          ): (
            <>
              <section className="h-full min-h-0 flex flex-col">
                <h1 className="p-3 border bg-secondary/50 rounded-lg font-bold mb-2">Content-type: {request.headers["content-type"]??"--"}</h1>
                <section className="min-w-full flex-1 bg-card/50 border rounded-md break-all p-2 whitespace-pre-wrap min-h-0 overflow-y-auto">{request.body}</section>
              </section>
            </>
          )}
          
        </TabsContent>
        <TabsContent value="params" className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col">
          <section className="flex flex-col w-full h-full min-h-0 overflow-y-auto font-sans gap-2">
            {Array.from(new URL(request.url).searchParams).map(([param, val], i) => {
              return (
                <section key={i} className="flex border-b p-1">
                  <h1 className="w-60 shrink-0 font-semibold">{param}</h1>
                  <p className="break-all whitespace-pre-wrap flex-1 min-w-0">{val}</p>
                </section>
              )
            })}
          </section>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RequestViewer

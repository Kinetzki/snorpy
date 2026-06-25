import { IResponse } from "@/interfaces/logInterfaces";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ResponseViewerProps {
    response: IResponse;
}

const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
    return (
        <div className="w-full h-full min-h-0">
            <Tabs defaultValue="headers" className="flex flex-col h-full">
                <TabsList variant={"line"}>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>
                <TabsContent
                    value="headers"
                    className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                    <section className="flex flex-col w-full h-full min-h-0 overflow-y-auto font-sans gap-2">
                        {Object.entries(response.headers).map(
                            ([header, val], i) => {
                                return (
                                    <section
                                        key={i}
                                        className="flex border-b p-1"
                                    >
                                        <h1 className="w-60 shrink-0 font-semibold">
                                            {header}
                                        </h1>
                                        <p className="break-all whitespace-pre-wrap flex-1 min-w-0">
                                            {val}
                                        </p>
                                    </section>
                                );
                            },
                        )}
                    </section>
                </TabsContent>
                <TabsContent
                    value="body"
                    className="flex-1 min-h-0 data-[state=active]:flex data-[state=active]:flex-col"
                >
                    <section className="h-full min-h-0 flex flex-col">
                        <h1 className="p-3 border bg-secondary/50 rounded-lg font-bold mb-2">
                            Content-type:{" "}
                            {response.headers["content-type"] ?? "--"}
                        </h1>
                        <section className="min-w-full flex-1 bg-card/50 border rounded-md break-all p-2 whitespace-pre-wrap min-h-0 overflow-y-auto">
                            {response.body}
                        </section>
                    </section>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ResponseViewer;

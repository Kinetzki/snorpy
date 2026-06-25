import { useRepeaterStore } from '@/stores/RepeaterStore';
import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlusIcon, XIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';

interface RequestHeaderProps {
    headers: Record<string, any>
    allowEdit?: boolean
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ headers, allowEdit=false }) => {
    const { onRepeatRequestHeaderChange, onRepeatRequestHeaderRemove } = useRepeaterStore();

    return (
        <section className="flex flex-col w-full h-full min-h-0 overflow-y-auto font-sans gap-2">
            {allowEdit ? (
                <>
                    {Object.entries(headers).map(([header, val], i) => {
                        return (
                            <section key={i} className="flex p-1 gap-2 border-b">
                                <Input 
                                    type="text" 
                                    placeholder="Header Name"
                                    className="w-60 shrink-0 bg-card/50 border rounded-md"
                                    value={header} 
                                    onChange={(e) => onRepeatRequestHeaderChange(e.target.value, val)} 
                                />
                                <Textarea
                                    className="flex-1 min-w-0 bg-card/50 border rounded-md"
                                    placeholder="Header Value"
                                    value={val}
                                    onChange={(e) => onRepeatRequestHeaderChange(header, e.target.value)}
                                />
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => onRepeatRequestHeaderRemove(header)}
                                >
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            </section>
                        )
                    })}
                </>
            ) : (
                <>
                    {Object.entries(headers).map(([header, val], i) => {
                        return (
                            <section key={i} className="flex border-b p-1">
                                <h1 className="w-60 shrink-0 font-semibold">{header}</h1>
                                <p className="break-all whitespace-pre-wrap flex-1 min-w-0">{val}</p>
                            </section>
                        )
                    })}
                </>
            )}
            {allowEdit && (
                <Button variant="outline" size="icon" onClick={() => onRepeatRequestHeaderChange("", "")}>
                    <PlusIcon className="w-4 h-4" />
                </Button>
            )}
        </section>
    )
}

export default RequestHeader

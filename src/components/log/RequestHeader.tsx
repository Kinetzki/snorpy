import React from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { PlusIcon, XIcon } from 'lucide-react';
import HeaderValueHighlight from './HeaderValueHighlight';

interface RequestHeaderProps {
    headers: Record<string, any>
    allowEdit?: boolean
    onHeaderValueChange?: (header: string, value: string) => void
    onHeaderRemove?: (header: string) => void
    isHighlightPayloadPositions?: boolean
}

const RequestHeader: React.FC<RequestHeaderProps> = ({ headers, allowEdit=false, onHeaderValueChange, onHeaderRemove, isHighlightPayloadPositions=false }) => {

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
                                    onChange={(e) => onHeaderValueChange?.(header, e.target.value)} 
                                />
                                <HeaderValueHighlight 
                                    value={val} 
                                    onChange={(value) => onHeaderValueChange?.(header, value)} 
                                    isHighlightPayloadPositions={isHighlightPayloadPositions}
                                />
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => onHeaderRemove?.(header)}
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
                <Button variant="outline" size="icon" onClick={() => onHeaderValueChange?.("", "")}>
                    <PlusIcon className="w-4 h-4" />
                </Button>
            )}
        </section>
    )
}

export default RequestHeader

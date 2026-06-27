import React, { useRef, useCallback } from 'react'

const HIGHLIGHT_SPLIT = /(§[^§]+§)/g;

interface HeaderValueHighlightProps {
    value: string
    onChange: (value: string) => void
    isHighlightPayloadPositions?: boolean
}

const HeaderValueHighlight: React.FC<HeaderValueHighlightProps> = ({ value, onChange, isHighlightPayloadPositions=false }) => {
    const highlightRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const syncScroll = useCallback(() => {
        if (highlightRef.current && textareaRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    }, []);

    return (
        <div className="relative flex-1 min-w-0">
            {/* highlight backdrop — mirrors textarea exactly */}
            <div
                ref={highlightRef}
                aria-hidden
                className="absolute inset-0 pointer-events-none overflow-hidden whitespace-pre-wrap break-all rounded-md border border-transparent"
                style={{
                    padding: '0.625rem',       // matches px-2.5 py-2
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    lineHeight: 'inherit',
                    letterSpacing: 'inherit',
                    wordSpacing: 'inherit',
                }}
            >
                {isHighlightPayloadPositions ? String(value).split(HIGHLIGHT_SPLIT).map((part, j) =>
                    part.startsWith('§') ? (
                        <mark key={j} className="payload-position-highlight text-transparent rounded-sm">
                            {part}
                        </mark>
                    ) : (
                        <span key={j} className="text-transparent">{part}</span>
                    )
                ) : String(value)}
            </div>
            {/* transparent textarea on top */}
            <textarea
                ref={textareaRef}
                className="flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                style={{ caretColor: 'auto', resize: 'none' }}
                placeholder="Header Value"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onScroll={syncScroll}
            />
        </div>
    )
}

export default HeaderValueHighlight
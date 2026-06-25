import React, { useRef } from 'react'
import { Editor, type Monaco, type OnChange } from "@monaco-editor/react";
import OceanicTheme from "./editor-theme";
import * as monaco from "monaco-editor";
import EditorLoader from './EditorLoader';

interface EditorProps {
  height: string;
  width: string;
  onChange: OnChange;
  code: string;
//   utilities: Utility[];
  language: string
//   onLanguageChange: (lang: Language) => void
  readOnly?: boolean
}

const CodeEditor: React.FC<EditorProps> = ({
    height,
    width,
    code,
    language,
    onChange,
    readOnly=false
}) => {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

    const handleEditorMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("oceanic-next", {
      base: "vs-dark",
      inherit: true,
      ...OceanicTheme,
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      tsx: "react",
    });
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  };
  
  const onMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    _: Monaco) => {
      editorRef.current = editor;
  }

  return (
    <div className="min-h-0" style={{
        width: width,
        height: height,
      }}>
      <Editor
          width={"100%"}
          height={"100%"}
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={onChange}
          beforeMount={handleEditorMount}
          onMount={onMount}
          theme="oceanic-next"
          options={{
            tabSize: 4,
            detectIndentation: true,
            acceptSuggestionOnCommitCharacter: true,
            acceptSuggestionOnEnter: "on",
            accessibilitySupport: "auto",
            autoIndent: "advanced",
            automaticLayout: true,
            codeLens: true,
            colorDecorators: true,
            contextmenu: true,
            cursorBlinking: "blink",
            cursorSmoothCaretAnimation: "off",
            cursorStyle: "line",
            disableLayerHinting: false,
            disableMonospaceOptimizations: false,
            dragAndDrop: false,
            fixedOverflowWidgets: false,
            folding: true,
            foldingStrategy: "auto",
            fontLigatures: false,
            formatOnPaste: false,
            formatOnType: false,
            hideCursorInOverviewRuler: false,
            links: true,
            mouseWheelZoom: false,
            multiCursorMergeOverlapping: true,
            multiCursorModifier: "alt",
            overviewRulerBorder: true,
            overviewRulerLanes: 2,
            quickSuggestions: true,
            quickSuggestionsDelay: 100,
            readOnly: readOnly,
            renderControlCharacters: false,
            renderFinalNewline: "on",
            renderLineHighlight: "all",
            renderWhitespace: "none",
            revealHorizontalRightPadding: 30,
            roundedSelection: true,
            rulers: [],
            scrollBeyondLastColumn: 5,
            scrollBeyondLastLine: true,
            selectOnLineNumbers: true,
            selectionClipboard: true,
            selectionHighlight: true,
            showFoldingControls: "mouseover",
            smoothScrolling: true,
            suggestOnTriggerCharacters: true,
            wordBasedSuggestions: "currentDocument",
            wordSeparators: "~!@#$%^&*()-=+[{]}|;:'\",.<>/?",
            wordWrap: "on",
            wordWrapBreakAfterCharacters: "\t})]?|&,;",
            wordWrapBreakBeforeCharacters: "{([+",
            wordWrapColumn: 80,
            wrappingIndent: "indent",
            minimap: { enabled: false }
          }}
          loading={<EditorLoader />}
        />
    </div>
  )
}

export default CodeEditor

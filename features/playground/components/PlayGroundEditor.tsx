import React, { useCallback, useRef } from 'react'
import { TemplateFile } from '../libs/PathToJson';
import { Editor, Monaco } from "@monaco-editor/react"
import { defaultEditorOptions, getEditorLanguage } from '../libs/EditorConfig';

interface PlaygroundEditorProps {
    activeFile: TemplateFile;
    content: string;
    onContentChange: (value: string) => void;
    suggestion: string | null
    suggestionLoading: boolean
    suggestionPosition: { line: number; column: number } | null
    onAcceptSuggestion: (editor: any, monaco: any) => void
    onRejectSuggestion: (editor: any) => void
    onTriggerSuggestion: (type: string, editor: any) => void
}

const PlayGroundEditor = ({ activeFile, content, onContentChange, suggestion, suggestionLoading, suggestionPosition, onAcceptSuggestion, onRejectSuggestion, onTriggerSuggestion }: PlaygroundEditorProps) => {

    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);
    const inlineCompletionProviderRef = useRef<any>(null)
    const currentSuggestionRef = useRef<{
        text: string
        position: { line: number; column: number }
        id: string
    } | null>(null)
    const isAcceptingSuggestionRef = useRef(false)
    const suggestionAcceptedRef = useRef(false)
    const suggestionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const tabCommandRef = useRef<any>(null)

    const generateSuggestionId = () => `suggestion-${Date.now()}-${Math.random()}`;

    const createInlineCompletionProvider = useCallback(
        () => { }, []
    )

    const clearCurrentSuggestion = useCallback(() => { }, []);

    const acceptCurrentSuggestion = useCallback(() => { }, []);

    const hasActiveSuggestionAtPosition = useCallback(() => { }, []);

    const updateEditorLanguage = () => { }

    const handleEditorDidMount = () => { }

    return (
        <div className='h-full relative'>
            {suggestionLoading && (
                <div className="absolute top-2 right-2 z-10 bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-xs text-red-700 dark:text-red-300 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    AI thinking...
                </div>
            )}

            {currentSuggestionRef.current && !suggestionLoading && (
                <div className="absolute top-2 right-2 z-10 bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Press Tab to accept
                </div>
            )}

            <Editor
                height="100%"
                value={content}
                onChange={(value) => onContentChange(value || "")}
                onMount={handleEditorDidMount}
                language={activeFile ? getEditorLanguage(activeFile.fileExtension || "") : "plaintext"}
                options={defaultEditorOptions as any}
            />
        </div>
    )
}

export default PlayGroundEditor;

"use client"
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PlayGroundEditor from '@/features/playground/components/PlayGroundEditor';
import TemplateFileTree from '@/features/playground/components/playgroundExplorer';
import { useFileExplorer } from '@/features/playground/hooks/useFileExplorer';
import usePlayground from '@/features/playground/hooks/usePlayground';
import { TemplateFile } from '@/features/playground/libs/PathToJson';
import { FileText, FolderOpen, Save, Settings, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'

const PlaygroundPage = () => {
  const { id } = useParams<{ id: string }>();

  const [confirmationDialog, setConfirmationDialog] = useState({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => { },
    onCancel: () => { },
  })

  const [isPreviewVisible, setIsPreviewVisible] = useState(true);
  const { playgroundData, templateData, isLoading, error, loadPlayground, saveTemplateData } = usePlayground(id);
  console.log("playgroundData", playgroundData)
  console.log("templateData", templateData)
  const {
    activeFileId,
    closeAllFiles,
    openFile,
    closeFile,
    editorContent,
    updateFileContent,
    handleAddFile,
    handleAddFolder,
    handleDeleteFile,
    handleDeleteFolder,
    handleRenameFile,
    handleRenameFolder,
    openFiles,
    setTemplateData,
    setActiveFileId,
    setPlaygroundId,
    setOpenFiles,
  } = useFileExplorer();

  console.log("openFiles", openFiles)
  const lastSyncedContent = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    setPlaygroundId(id);
  }, [id, setPlaygroundId])

  useEffect(() => {
    if (templateData && !openFiles.length) {
      setTemplateData(templateData);
    }
  }, [templateData, setTemplateData, openFiles.length])

  const activeFile = openFiles.find((file) => file.id === activeFileId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="w-full max-w-md p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 text-center">
            Loading Playground
          </h2>
          {/* <div className="mb-8">
            <LoadingStep
              currentStep={1}
              step={1}
              label="Loading playground data"
            />
            <LoadingStep
              currentStep={2}
              step={2}
              label="Setting up environment"
            />
            <LoadingStep currentStep={3} step={3} label="Ready to code" />
          </div> */}
        </div>
      </div>
    );
  }


  if (!templateData) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <FolderOpen className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-xl font-semibold text-amber-600 mb-2">
          No template data available
        </h2>
        <Button onClick={() => window.location.reload()} variant="outline">
          Reload Template
        </Button>
      </div>
    );
  }

  const handleSaveAll = () => { }

  const handleSave = () => { }

  const hasUnsavedChanges = activeFile?.hasUnsavedChanges || false;

  return (
    <TooltipProvider>
      <>
        <TemplateFileTree
          data={templateData as any}
          onFileSelect={() => { }}
          selectedFile={activeFile as any}
          title="Template Explorer"
          onAddFile={() => { }}
          onAddFolder={() => { }}
          onDeleteFile={() => { }}
          onDeleteFolder={() => { }}
          onRenameFile={() => { }}
          onRenameFolder={() => { }}
        />

        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <div>
              <div>
                <h1>{playgroundData?.name || "Code Playground"}</h1>
                <p>
                  {openFiles.length} file(s) open
                  {hasUnsavedChanges && " . Unsaved changes"}
                </p>
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave()}
                      disabled={!activeFile || !activeFile.hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save (Ctrl+S)</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSaveAll}
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" /> All
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Save All (Ctrl+Shift+S)</TooltipContent>
                </Tooltip>

                {/* <ToggleAI
                  isEnabled={aiSuggestions.isEnabled}
                  onToggle={aiSuggestions.toggleEnabled}
                  suggestionLoading={aiSuggestions.isLoading}
                /> */}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    >
                      {isPreviewVisible ? "Hide" : "Show"} Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={closeAllFiles}>
                      Close All Files
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <div>
            {
              openFiles.length > 0 ? (
                <div>
                  <div>
                    <Tabs
                      value={activeFileId || ""}
                      onValueChange={setActiveFileId}
                    >
                      <div>
                        <TabsList>
                          {
                            openFiles.map((file) => (
                              <TabsTrigger
                                key={file.id}
                                value={file.id}
                                className="relative h-8 px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm group"
                              >
                                <div>
                                  <FileText className="h-3 w-3" />
                                  <span>
                                    {file.filename}.{file.fileExtension}
                                  </span>
                                  {file.hasUnsavedChanges && (
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                  )}
                                  <span
                                    className="ml-2 h-4 w-4 hover:bg-destructive hover:text-destructive-foreground rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeFile(file.id);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </span>
                                </div>
                              </TabsTrigger>
                            ))
                          }
                        </TabsList>
                        {
                          openFiles.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={closeAllFiles}
                              className="h-6 px-2 text-xs"
                            >
                              Close All
                            </Button>
                          )
                        }
                      </div>
                    </Tabs>
                  </div>

                  <div>
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      <ResizablePanel defaultSize={isPreviewVisible ? 50 : 100}>
                        <PlayGroundEditor
                          activeFile={activeFile as TemplateFile}
                          content={editorContent}
                          onContentChange={(value) =>
                            activeFileId && updateFileContent(activeFileId, value)
                          }
                          suggestion={null}
                          suggestionLoading={false}
                          suggestionPosition={null}
                          onAcceptSuggestion={() => { }}
                          onRejectSuggestion={() => { }}
                          onTriggerSuggestion={() => { }}
                        />
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  </div>
                </div>
              ) : (
                <div>
                  <h1>No files open</h1>
                </div>
              )
            }
          </div>
        </SidebarInset>
      </>
    </TooltipProvider>
  )
}

export default PlaygroundPage;

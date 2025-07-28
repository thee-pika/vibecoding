import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sidebar, SidebarContent, SidebarGroup,SidebarMenuSub , SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from '@/components/ui/sidebar';
import { ChevronRight, Edit3, File, FilePlus, Folder, FolderPlus, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"

interface TemplateNodeProps {
    item: TemplateItem;
    onFileSelect?: (file: TemplateFile) => void;
    selectedFile?: TemplateFile;
    level: number;
    path?: string;
    onAddFile?: (file: TemplateFile, parentPath: string) => void;
    onAddFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile?: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder?: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile?: (file: TemplateFile, newName: string, newFileExt: string, parentPath: string) => void;
    onRenameFolder: (folder: TemplateFolder, newName: string, parentPath: string) => void;
}

interface TemplateFile {
    filename: string;
    fileExtension: string;
    content: string;
}

interface TemplateFolder {
    folderName: string;
    items: (TemplateFile | TemplateFolder)[];
}

type TemplateItem = TemplateFile | TemplateFolder;

interface TemplateFileTreeProps {
    data: TemplateItem;
    onFileSelect: (file: TemplateFile) => void;
    selectedFile: TemplateFile;
    title: string;
    onAddFile: (file: TemplateFile, parentPath: string) => void;
    onAddFolder: (folder: TemplateFolder, parentPath: string) => void;
    onDeleteFile: (file: TemplateFile, parentPath: string) => void;
    onDeleteFolder: (folder: TemplateFolder, parentPath: string) => void;
    onRenameFile: (file: TemplateFile, newName: string, newFileExt: string, parentPath: string) => void;
    onRenameFolder: (folder: TemplateFolder, newName: string, parentPath: string) => void;

}

const TemplateFileTree = ({
    data,
    onFileSelect,
    selectedFile,
    title,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder,
}: TemplateFileTreeProps) => {

    const isRootFolder = data && typeof data === "object" && "folderName" in data;
    console.log("isRootFolder", isRootFolder)
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = React.useState(false)
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = React.useState(false)
    console.log("data in template file tree", data)
    const handleCreateFile = (filename: string, extension: string) => {
        setIsNewFileDialogOpen(true)
    }

    const handleCreateFolder = (folderName: string) => {
        setIsNewFolderDialogOpen(true)
    }

    const handleAddRootFile = () => {
        setIsNewFileDialogOpen(true)
    }
    const handleAddRootFolder = () => {
        setIsNewFolderDialogOpen(true)
    }

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>{title}</SidebarGroupLabel>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarGroupAction> <Plus className="h-4 w-4" /></SidebarGroupAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={handleAddRootFile}>
                                <FilePlus className="h-4 w-4 mr-2" />
                                New File
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleAddRootFolder}>
                                <FolderPlus className="h-4 w-4 mr-2" />
                                New Folder
                            </DropdownMenuItem>
                        </DropdownMenuContent>

                    </DropdownMenu>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                isRootFolder ? (
                                    (data as TemplateFolder).items.map((item, index) => (
                                        <TemplateNode
                                            key={index}
                                            item={item}
                                            onFileSelect={onFileSelect}
                                            selectedFile={selectedFile}
                                            level={0}
                                            path={""}
                                            onAddFile={onAddFile}
                                            onAddFolder={onAddFolder}
                                            onDeleteFile={onDeleteFile}
                                            onDeleteFolder={onDeleteFolder}
                                            onRenameFile={onRenameFile}
                                            onRenameFolder={onRenameFolder}
                                        />
                                    ))
                                ) : (
                                    <TemplateNode
                                        item={data}
                                        onFileSelect={onFileSelect}
                                        selectedFile={selectedFile}
                                        level={0}
                                        path={""}
                                        onAddFile={onAddFile}
                                        onAddFolder={onAddFolder}
                                        onDeleteFile={onDeleteFile}
                                        onDeleteFolder={onDeleteFolder}
                                        onRenameFile={onRenameFile}
                                        onRenameFolder={onRenameFolder}
                                    />
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarRail />

            <NewFileDialog
                isOpen={isNewFileDialogOpen}
                onClose={() => setIsNewFileDialogOpen(false)}
                onCreateFile={handleCreateFile}
            />

            <NewFolderDialog
                isOpen={isNewFolderDialogOpen}
                onClose={() => setIsNewFolderDialogOpen(false)}
                onCreateFolder={handleCreateFolder}
            />

        </Sidebar>
    )
}

export function TemplateNode({
    item,
    onFileSelect,
    selectedFile,
    level,
    path,
    onAddFile,
    onAddFolder,
    onDeleteFile,
    onDeleteFolder,
    onRenameFile,
    onRenameFolder,
}: TemplateNodeProps) {
    console.log("item in template node", item)
    const isValidItem = item && typeof item === "object";
    const isFolder = isValidItem && "folderName" in item;
    const [isNewFileDialogOpen, setIsNewFileDialogOpen] = useState(false)
    const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false)
    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    if (!isValidItem) return null;
    if (!isFolder) {
        const file = item as TemplateFile
        const fileName = `${file.filename}.${file.fileExtension}`

        const isSelected =
            selectedFile && selectedFile.filename === file.filename && selectedFile.fileExtension === file.fileExtension

        const handleRename = () => {
            setIsRenameDialogOpen(true);
        }

        const handleDelete = () => {
            setIsDeleteDialogOpen(true);
        }

        return (
            <SidebarMenuItem>
                <div className="flex items-center group">
                    <SidebarMenuButton isActive={isSelected} onClick={() => onFileSelect?.(file)}>
                        <File className="h-4 w-4 mr-2 shrink-0" />
                        <span>{fileName}</span>
                    </SidebarMenuButton>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <MoreHorizontal className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem onClick={handleRename}>
                                <Edit3 className="h-4 w-4 mr-2" />
                                Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </SidebarMenuItem>
        )

    } else {
        const folder = item as TemplateFolder
        const folderName = folder.folderName
        const currentPath = path ? `${path}/${folderName}` : folderName

        const handleAddFile = () => {
            setIsNewFileDialogOpen(true)
        }

        const handleAddFolder = () => {
            setIsNewFolderDialogOpen(true)
        }

        const handleRename = () => {
            setIsRenameDialogOpen(true)
        }

        const handleDelete = () => {
            setIsDeleteDialogOpen(true)
        }

        const confirmDelete = () => {
            onDeleteFolder?.(folder, path as string)
            setIsDeleteDialogOpen(false)
        }
        const handleCreateFile = (filename: string, extension: string) => {
            if (onAddFile) {
                const newFile: TemplateFile = {
                    filename,
                    fileExtension: extension,
                    content: "",
                }
                onAddFile(newFile, currentPath)
            }
            setIsNewFileDialogOpen(false)
        }

        const handleCreateFolder = (folderName: string) => {
            if (onAddFolder) {
                const newFolder: TemplateFolder = {
                    folderName,
                    items: [],
                }
                onAddFolder(newFolder, currentPath)
            }
            setIsNewFolderDialogOpen(false)
        }

        const handleRenameSubmit = (newFolderName: string) => {
            onRenameFolder?.(folder, newFolderName, path as string)
            setIsRenameDialogOpen(false)
        }
        return (
            <SidebarMenuItem>
                <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="group/collapsible [&[data-state=open]>div>button>svg:first-child]:rotate-90"
                >
                    <div className="flex items-center group">
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton className="flex-1">
                                <ChevronRight className="transition-transform" />
                                <Folder className="h-4 w-4 mr-2 shrink-0" />
                                <span>{folderName}</span>
                            </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleAddFile}>
                                    <FilePlus className="h-4 w-4 mr-2" />
                                    New File
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleAddFolder}>
                                    <FolderPlus className="h-4 w-4 mr-2" />
                                    New Folder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleRename}>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {folder.items.map((childItem, index) => (
                                <TemplateNode
                                    key={index}
                                    item={childItem}
                                    onFileSelect={onFileSelect}
                                    selectedFile={selectedFile}
                                    level={level + 1}
                                    path={currentPath}
                                    onAddFile={onAddFile}
                                    onAddFolder={onAddFolder}
                                    onDeleteFile={onDeleteFile}
                                    onDeleteFolder={onDeleteFolder}
                                    onRenameFile={onRenameFile}
                                    onRenameFolder={onRenameFolder}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </Collapsible>

                <NewFileDialog
                    isOpen={isNewFileDialogOpen}
                    onClose={() => setIsNewFileDialogOpen(false)}
                    onCreateFile={handleCreateFile}
                />

                <NewFolderDialog
                    isOpen={isNewFolderDialogOpen}
                    onClose={() => setIsNewFolderDialogOpen(false)}
                    onCreateFolder={handleCreateFolder}
                />

                <RenameFolderDialog
                    isOpen={isRenameDialogOpen}
                    onClose={() => setIsRenameDialogOpen(false)}
                    onRename={handleRenameSubmit}
                    currentFolderName={folderName}
                />

                <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{folderName}" and all its contents? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </SidebarMenuItem>
        )
    }

}


interface NewFileDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateFile: (filename: string, extension: string) => void
}

function NewFileDialog({ isOpen, onClose, onCreateFile }: NewFileDialogProps) {
    const [filename, setFilename] = React.useState("")
    const [extension, setExtension] = React.useState("js")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (filename.trim()) {
            onCreateFile(filename.trim(), extension.trim() || "js")
            setFilename("")
            setExtension("js")
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New File</DialogTitle>
                    <DialogDescription>Enter a name for the new file and select its extension.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="filename" className="text-right">
                                Filename
                            </Label>
                            <Input
                                id="filename"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="col-span-2"
                                autoFocus
                                placeholder="main"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="extension" className="text-right">
                                Extension
                            </Label>
                            <Input
                                id="extension"
                                value={extension}
                                onChange={(e) => setExtension(e.target.value)}
                                className="col-span-2"
                                placeholder="js"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!filename.trim()}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface RenameFileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (newName: string, newFileExt: string) => void;
    currentName: string;
    currentFileExt: string;
}

interface NewFolderDialogProps {
    isOpen: boolean
    onClose: () => void
    onCreateFolder: (folderName: string) => void
}

function NewFolderDialog({ isOpen, onClose, onCreateFolder }: NewFolderDialogProps) {
    const [folderName, setFolderName] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (folderName.trim()) {
            onCreateFolder(folderName.trim())
            setFolderName("")
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>Enter a name for the new folder.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="foldername" className="text-right">
                                Folder Name
                            </Label>
                            <Input
                                id="foldername"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                className="col-span-2"
                                autoFocus
                                placeholder="components"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!folderName.trim()}>
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

const RenameFileDialog = ({ isOpen, onClose, onRename, currentName, currentFileExt }: RenameFileDialogProps) => {
    const [filename, setFilename] = useState(currentName)
    const [extension, setExtension] = useState(currentFileExt)

    useEffect(() => {
        if (isOpen) {
            setFilename(currentName)
            setExtension(currentFileExt)
        }
    }, [isOpen, currentName, currentFileExt])

    const handleSubmit = () => { }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename File</DialogTitle>
                    <DialogDescription>
                        Rename the file to a new name and extension.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rename-filename" className="text-right">
                                Filename
                            </Label>
                            <Input
                                id="rename-filename"
                                value={filename}
                                onChange={(e) => setFilename(e.target.value)}
                                className="col-span-2"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rename-extension" className="text-right">
                                Extension
                            </Label>
                            <Input
                                id="rename-extension"
                                value={extension}
                                onChange={(e) => setExtension(e.target.value)}
                                className="col-span-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!filename.trim()}>
                            Rename
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

interface RenameFolderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onRename: (newName: string) => void;
    currentFolderName: string;
}

const RenameFolderDialog = ({ isOpen, onClose, onRename, currentFolderName }: RenameFolderDialogProps) => {
    const [folderName, setFolderName] = useState(currentFolderName);

    useEffect(() => {
        if (isOpen) {
            setFolderName(currentFolderName)
        }
    }, [isOpen, currentFolderName])

    const handleSubmit = () => { }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename Folder</DialogTitle>
                    <DialogDescription>Enter a new name for the folder.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="rename-foldername" className="text-right">
                                Folder Name
                            </Label>
                            <Input
                                id="rename-foldername"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                className="col-span-2"
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!folderName.trim()}>
                            Rename
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default TemplateFileTree;
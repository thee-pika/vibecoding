"use client"

import Image from "next/image"
import { format, set } from "date-fns"
import { ProjectT } from "../types"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"
import { MoreHorizontal, Edit3, Trash2, ExternalLink, Copy, Download, Eye } from "lucide-react"
import { toast } from "sonner"
import { MarkedToggleButton } from "./ToggleStar"

interface ProjectTableProps {
    projects: ProjectT[];
    onProjectUpdate?: (id: string, data: {
        title: string;
        description: string;
    }) => void;
    onProjectDelete?: (id: string) => void;
    onDuplicateProject?: (id: string) => void;
    onMarkAsFavorite?: (id: string, isMarked: boolean) => void;
}
const ProjectTable = ({
    projects,
    onProjectUpdate,
    onProjectDelete,
    onDuplicateProject,
    onMarkAsFavorite,
}: ProjectTableProps) => {
    console.log("projects", projects)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editData, setEditData] = useState({
        title: "",
        description: ""
    })
    const [selectedProject, setSelectedProject] = useState<ProjectT | null>(null);


    const handleDeleteClick = (project: ProjectT) => {
        setSelectedProject(project);
        setDeleteDialogOpen(true);
    }

    const handleEditClick = (project: ProjectT) => {
        setSelectedProject(project);
        setEditData({
            title: project.title,
            description: project.description || ""
        })
        setEditDialogOpen(true);
    }

    const handleDuplicateProject = async (project: ProjectT) => {
        if (!onDuplicateProject) return;
        setIsLoading(true);
        try {
            await onDuplicateProject(project.id);
            toast.success("Project duplicated successfully")
        } catch (error) {
            toast.error("Failed to duplicate project")
            console.error("Error duplicating project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteProject = async () => {
        if (!selectedProject || !onProjectDelete) return;
        setIsLoading(true);
        try {
            await onProjectDelete(selectedProject.id);
            setDeleteDialogOpen(false);
            setSelectedProject(null);
            toast.success("Project deleted successfully")
        } catch (error) {
            toast.error("Failed to delete project")
            console.error("Error deleting project:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateProject = async () => {
        if (!selectedProject || !onProjectUpdate) return;

        setIsLoading(true);

        try {
            await onProjectUpdate(selectedProject.id, editData);
            setEditDialogOpen(false);
            setSelectedProject(null);
            toast.success("Project updated successfully")
        } catch (error) {
            toast.error("Failed to update project")
            console.error("Error updating project:", error)

        } finally {
            setIsLoading(false)
        }
    }

    const copyProjectUrl = (id: string) => {
        const url = `${window.location.origin}/playground/${id}`;
        navigator.clipboard.writeText(url);
        toast.success("Project URL copied to clipboard");
    }

    return (
        <>
            <div className="border rounded-lg overflow-hidden bg-gray-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-white">Project</TableHead>
                            <TableHead className="text-white">Template</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">User</TableHead>
                            <TableHead className="w-[50px] text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            projects.map((project: any) => (
                                <TableRow key={project.id}>
                                    <TableCell>
                                        <div>
                                            <Link href={`/playground/${project.id}`}>
                                                <span className="font-semibold text-white ">{project.title}</span>
                                            </Link>
                                            <p className="text-sm  text-gray-400">{project.description}</p>
                                        </div>

                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-[#E93F3F15] text-[#E93F3F] border-[#E93F3F]">
                                            {project.template}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-white">{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                                <Image
                                                    src={project.user.image}
                                                    alt={project.user.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="text-sm text-white">{project.user.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>

                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem asChild>
                                                    <MarkedToggleButton markedForRevision={project.Starmark[0]?.isMarked} id={project.id} />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/playground/${project.id}`} className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Open Project
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/playground/${project.id}`} target="_blank" className="flex items-center">
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        Open in New Tab
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleEditClick(project)}>
                                                    <Edit3 className="h-4 w-4 mr-2" />
                                                    Edit Project
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDuplicateProject(project)}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Duplicate
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => copyProjectUrl(project.id)}>
                                                    <Download className="h-4 w-4 mr-2" />
                                                    Copy URL
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteClick(project)}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete Project
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Make changes to your project details here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Project Title</Label>
                            <Input
                                id="title"
                                value={editData.title}
                                onChange={(e) => setEditData((prev) => ({ ...prev, title: e.target.value }))}
                                placeholder="Enter project title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={editData.description}
                                onChange={(e) => setEditData((prev) => ({ ...prev, description: e.target.value }))}
                                placeholder="Enter project description"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleUpdateProject} disabled={isLoading || !editData.title.trim()}>
                            {isLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{selectedProject?.title}"? This action cannot be undone. All files and
                            data associated with this project will be permanently removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteProject}
                            disabled={isLoading}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isLoading ? "Deleting..." : "Delete Project"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default ProjectTable
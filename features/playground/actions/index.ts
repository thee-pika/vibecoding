"use server"

import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { TemplateFolder } from "../libs/PathToJson";
import { currentUser } from "@/features/auth/actions";

const toggleStarMarked = async (playgroundId: string, isMarked: boolean) => {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error("User ID is required");
        }

        if (isMarked) {
            await db.starMark.create({
                data: {
                    userId: user.id!,
                    playgroundId,
                    isMarked,
                }
            })
        } else {
            await db.starMark.delete({
                where: {
                    userId_playgroundId: {
                        userId: user.id!,
                        playgroundId,
                    }
                }
            })
        }

        revalidatePath("/dashboard");
        return { success: true, isMarked: isMarked };
    } catch (error) {
        console.log(error);
        return { success: false, error: "Failed to toggle star marked" };
    }
}

const SaveUpdatedCode = async (playgroundId: string, data: TemplateFolder) => {
    try {
        const user = await currentUser();
        if (!user) return null;

        const updatedPlayground = await db.templateFile.upsert({
            where: {
                playgroundId
            },
            update: {
                content: JSON.stringify(data),
            },
            create: {
                playgroundId,
                content: JSON.stringify(data),
            }
        })

        return updatedPlayground;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const createPlayGround = async (data: {
    title: string;
    description?: string;
    template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
}) => {
    const { title, description, template } = data;
    const user = await currentUser();

    try {
        const playground = await db.playground.create({
            data: {
                title,
                description,
                template,
                userId: user?.id!,
            }
        })

        return playground;
    } catch (error) {
        console.log(error);
    }
}

const getUserPlaygrounds = async () => {
    const user = await currentUser();
    try {
        const playgrounds = await db.playground.findMany({
            where: {
                userId: user?.id!,
            },
            include: {
                user: true,
                Starmark: {
                    where: {
                        userId: user?.id!,
                    },
                    select: {
                        isMarked: true,
                    }
                }
            }
        });

        return playgrounds.map((p) => ({
            ...p,
            description: p.description ?? "",
            user: {
                ...p.user,
                name: p.user.name ?? "Anonymous",
                image: p.user.image ?? "",
            }
        }));

    } catch (error) {
        console.log(error);
        return [];
    }
}

const getPlayGroundById = async (id: string) => {
    try {
        const playground = await db.playground.findUnique({
            where: { id },
            select: {
                templateFiles: {
                    select: {
                        content: true,
                    }
                }
            }
        });

        return playground;
    } catch (error) {
        console.log(error);
    }
}

const deleteProjectById = async (id: string) => {
    try {
        await db.playground.delete({
            where: { id },
        });

        revalidatePath("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

const editProjectById = async (id: string, data: {
    title: string;
    description?: string;
}) => {
    try {
        await db.playground.update({
            where: { id },
            data: data
        })
        revalidatePath("/dashboard");
    } catch (error) {
        console.log(error);
    }
}

const duplicateProjectById = async (id: string) => {
    try {
        const originalPlayground = await db.playground.findFirst({
            where: {
                id
            },
            include: {
                templateFiles: true,
            }
        })

        if (!originalPlayground) {
            throw new Error("Playground not found");
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId,
                templateFiles: {
                    create: originalPlayground.templateFiles
                        .filter((file) => file.content !== null)
                        .map((file) => ({
                            content: file.content as Prisma.InputJsonValue,
                        }))
                }
            }
        })

        revalidatePath("/dashboard");

        return duplicatedPlayground;
    } catch (error) {
        console.log("Error duplicating project:", error);
    }
}

export { getPlayGroundById, deleteProjectById, editProjectById, duplicateProjectById, createPlayGround, getUserPlaygrounds, toggleStarMarked, SaveUpdatedCode }

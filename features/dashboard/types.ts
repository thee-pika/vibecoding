interface UserT {
    id: string
    name: string
    email: string
    image: string
    role: string
    createdAt: Date
    updatedAt: Date
}

interface ProjectT {
    id: string;
    title: string;
    description: string | null;
    template: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    user: UserT
    Starmark: { isMarked: boolean }[]
}

export type { UserT, ProjectT };




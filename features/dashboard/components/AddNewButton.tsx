"use client"
import TemplateSelectorModal from '@/components/modals/TemplateSelectorModal';
import { Button } from '@/components/ui/button';
import { createPlayGround } from '@/features/playground/actions';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const AddNewButton = () => {
    const [isModalOpen, setisModalOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<{
        title: string;
        template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
        description?: string;
    } | null>(null);

    const router = useRouter();

    const handleSubmit = async (data: {
        title: string;
        description?: string;
        template: "REACT" | "NEXTJS" | "EXPRESS" | "VUE" | "HONO" | "ANGULAR";
    }) => {
        console.log(data);
        setSelectedTemplate(data);

        const res = await createPlayGround(data);
        toast("Playground created successfully");
        setisModalOpen(false);
        router.push(`/playground/${res?.id}`);
    }

    return (
        <>
            <div
                onClick={() => setisModalOpen(true)}
                className='hover:bg-gray-700 bg-gray-900 flex justify-evenly pt-8'
            >
                <div className='flex items-center justify-center gap-10'>
                    <Button>
                        <Plus size={30} className="transition-transform duration-300 group-hover:rotate-90" />
                    </Button>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-bold text-[#e93f3f]">Add New</h1>
                        <p className="text-sm text-muted-foreground max-w-[220px]">Create a new playground</p>
                    </div>
                </div>
                <div className="relative overflow-hidden flex justify-center items-center">
                    <Image
                        src="/new.png"
                        alt="add-new-playground"
                        width={150}
                        height={150}
                        className="transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            </div>

            <TemplateSelectorModal
                isOpen={isModalOpen}
                onClose={() => setisModalOpen(false)}
                onSubmit={handleSubmit}
            />
        </>
    )
}

export default AddNewButton;

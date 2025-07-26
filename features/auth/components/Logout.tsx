"use client"
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React from 'react'

const Logout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const handleLogout = async () => {
        await signOut();
        router.refresh();
    }
    return (
        <span onClick={handleLogout}>{children}</span>
    )
}

export default Logout;

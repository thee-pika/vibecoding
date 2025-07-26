"use client"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { useCurrentUser } from '../hooks/useCurrentUser';
import Logout from './Logout';
import Image from 'next/image';

const User = () => {
    const user = useCurrentUser();
    console.log("user", user);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="w-10 h-10">
                   
                    <Image
                        src={user?.image || ""}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    <AvatarFallback>
                        <User2 />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <span>
                        {user?.email}
                    </span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <Logout>
                    <DropdownMenuItem>
                        <LogOut />
                        Logout
                    </DropdownMenuItem>
                </Logout>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default User;

"use client"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Database, Compass, FlameIcon, Code2, Home, LayoutDashboard, LucideIcon, Plus, Star, Terminal, Lightbulb, Zap, History, FolderPlus, Settings } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react';

interface PlayGroundData {
    id: string;
    name: string;
    icon: string;
    starred: boolean;
}

const lucideIconMap: Record<string, LucideIcon> = {
    Zap: Zap,
    Lightbulb: Lightbulb,
    Database: Database,
    Compass: Compass,
    FlameIcon: FlameIcon,
    Terminal: Terminal,
    Code2: Code2,
}

const DashboardSidebar = ({ initialPlayGrounds }: { initialPlayGrounds: PlayGroundData[] }) => {
    const pathname = usePathname();
    const [starredPlayGrounds, setStarredPlayGrounds] = useState(initialPlayGrounds.filter(playGround => playGround.starred));
    const [recentPlayGrounds, setRecentPlayGrounds] = useState(initialPlayGrounds);
    console.log(pathname);
    return (
        <Sidebar variant='inset' collapsible='icon' className='border-1 border-r '>
            <SidebarHeader >
                <div className="flex items-center gap-2 px-4 py-3 justify-center bg-gray-900" style={{ backgroundColor: "black" }}>
                    <Image src={"/main-logo.png"} alt="logo" width={60} height={60} />
                </div>
            </SidebarHeader>
            <SidebarContent className='bg-gray-900'>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem >
                            <SidebarMenuButton asChild isActive={pathname === "/"} tooltip={"Home"} className='hover:bg-gray-700'>
                                <Link href={"/"}>
                                    <Home className='w-4 h-4 mr-2 text-gray-300' />
                                    <span className='text-gray-300 '>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Dashboard"}
                                className={` ${pathname === "/dashboard" ? "bg-black text-white" : "text-gray-300 hover:bg-gray-700"
                                    }`}
                            >
                                <Link href={"/dashboard"}>
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className='text-gray-300'>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>
                        <Star className="h-4 w-4 mr-2 text-gray-300" />
                        <span className='text-gray-300'>Starred</span>
                    </SidebarGroupLabel>
                    <SidebarGroupAction title='Add starred PlayGround'>
                        <Plus className="h-4 w-4" />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                starredPlayGrounds.length === 0 && recentPlayGrounds.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-4 w-full">Create your playground</div>
                                ) : (
                                    starredPlayGrounds.map((playGround) => {
                                        const IconComponent = lucideIconMap[playGround.icon] || Code2;
                                        return (
                                            <SidebarMenuItem key={playGround.id}>
                                                <SidebarMenuButton asChild isActive={pathname === `/dashboard/playground/${playGround.id}`} tooltip={playGround.name}>
                                                    <Link href={`/playground/${playGround.id}`}>
                                                        <IconComponent className="h-4 w-4" />
                                                        <span>{playGround.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    }
                                    )
                                )
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <History className="h-4 w-4 mr-2" />
                        Recent
                    </SidebarGroupLabel>
                    <SidebarGroupAction title='create new playground'>
                        <FolderPlus className="h-4 w-4" />
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                starredPlayGrounds.length === 0 && recentPlayGrounds.length === 0 ? null : (
                                    recentPlayGrounds.map((playground) => {
                                        const IconComponent = lucideIconMap[playground.icon] || Code2;
                                        return (
                                            <SidebarMenuItem key={playground.id}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={pathname === `/playground/${playground.id}`}
                                                    tooltip={playground.name}
                                                >
                                                    <Link href={`/playground/${playground.id}`}>
                                                        {IconComponent && <IconComponent className="h-4 w-4" />}
                                                        <span>{playground.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        )
                                    })
                                )
                            }
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="view all" className='hover:bg-gray-700'>
                                    <Link href="/playgrounds">
                                        <span className="text-sm text-muted-foreground">View all playgrounds</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="settings" className='hover:bg-gray-700'>
                            <Link href="/settings">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default DashboardSidebar;

import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardSidebar from '@/features/dashboard/DashboardSidebar'
import { getUserPlaygrounds } from '@/features/playground/actions'
import React from 'react'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {

  const playGroundData = await getUserPlaygrounds();
  console.log("playGroundData", playGroundData);
  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  }

  const formattedPlayGroundData = playGroundData?.map((playGround) => ({
    id: playGround.id,
    name: playGround.title,
    icon: technologyIconMap[playGround.template] || "Code2",
    starred: playGround.Starmark[0]?.isMarked || false,
  })) || [];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-black">
        <DashboardSidebar initialPlayGrounds={formattedPlayGroundData} />
        <main className="flex-1 ">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}

export default DashboardLayout;

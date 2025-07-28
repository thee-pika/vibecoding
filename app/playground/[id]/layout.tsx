import { SidebarProvider } from "@/components/ui/sidebar";

const PlayGroundLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  )
}

export default PlayGroundLayout;

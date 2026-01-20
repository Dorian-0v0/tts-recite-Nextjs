
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ChatCom from "@/components/ChatCom";

export default function ChatLayout({ children }: { children: React.ReactNode }) {



  return (

    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger></SidebarTrigger>
     <ChatCom></ChatCom>
    </SidebarProvider>
  );
}
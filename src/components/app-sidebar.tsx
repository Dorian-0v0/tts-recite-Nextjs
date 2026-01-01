// src/components/app-sidebar.tsx
"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Settings, LogOut, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 模拟会话数据（实际项目中应从状态管理或 API 获取）
const conversations = [
  { id: "1", title: "如何写 React Hook？" },
  { id: "2", title: "解释量子计算原理" },
  { id: "3", title: "生成一首唐诗" },
  { id: "4", title: "调试 Next.js SSR 错误" },
  { id: "5", title: "如何使用 Tailwind CSS？" },
  { id: "6", title: "如何使用 TypeScript？" },
  { id: "7", title: "如何使用 Vue.js？" },
  { id: "8", title: "如何使用 React.js？" },
  { id: "9", title: "如何使用 Vue.js？" },
  { id: "10", title: "如何使用 React.js？" },
  { id: "11", title: "如何使用 Vue.js？" },
  { id: "12", title: "如何使用 React.js？" },
  { id: "13", title: "如何使用 Vue.js？" },
];

export function AppSidebar() {
  const [activeConvId, setActiveConvId] = React.useState<string>("1");

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex  gap-2">
          <MessageSquare className="h-6 w-6 text-sidebar-primary" />
          <span className="font-bold">TSS-Ai带背</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3 hover:cursor-pointer border-sidebar-border
          "
          onClick={() => {
            // 实际应调用新建会话逻辑
            console.log("New conversation");
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          新建聊天
        </Button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {conversations.map((conv) => (
            <SidebarMenuItem key={conv.id}>
              <SidebarMenuButton
                asChild
                isActive={conv.id === activeConvId}
                onClick={() => setActiveConvId(conv.id)}
              >
                <a href="#" className="truncate">
                  {conv.title}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <a href="/logout" className="text-destructive hover:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                登出
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="mt-4">
            <SidebarMenuButton className="justify-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="truncate">user@example.com</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* <SidebarRail /> */}
    </Sidebar>
  );
}
import { LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTheme } from "next-themes";

export function DialogDemo() {
    const { setTheme, theme } = useTheme()
    const handleThemeChange = (value: string) => {
        console.log(value)
        setTheme(value)
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild className="hover:cursor-pointer">
                            <a>
                                <Settings className="mr-2 h-4 w-4" />
                                设置
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>设置</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center">
                        <Label htmlFor="theme" className="mr-20">主题外观：</Label>
                        <Select defaultValue={theme} onValueChange={handleThemeChange}> {/* 👈 关键：设置 defaultValue */}
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="系统" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="system">系统</SelectItem>
                                    <SelectItem value="light">白天</SelectItem>
                                    <SelectItem value="dark">夜间</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center">
                        <Label htmlFor="theme" className="mr-20">语音设置：</Label>
                        <Select defaultValue="甜美"> {/* 👈 关键：设置 defaultValue */}
                            <SelectTrigger className="w-[180px]" id="theme">
                                <SelectValue placeholder="甜美" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="甜美">甜美</SelectItem>
                                    <SelectItem value="白天">白天</SelectItem>
                                    <SelectItem value="夜间">夜间</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>



                </DialogContent>
            </form>
        </Dialog>
    )
}
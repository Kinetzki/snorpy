import {
    BookOpenIcon,
    BotIcon,
    ChevronRight,
    LucideIcon,
    PanelLeft,
    PanelLeftClose,
    Settings2Icon,
    TerminalSquareIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarItem {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
}

const sidebarItems: SidebarItem[] = [
    {
        title: "Proxy",
        url: "/proxy",
        icon: TerminalSquareIcon,
        isActive: true,
        items: [
            {
                title: "Target",
                url: "/proxy/target",
            },
            {
                title: "Interceptor",
                url: "/proxy/interceptor",
            },
            {
                title: "Logs",
                url: "/proxy/logs",
            },
        ],
    },
    {
        title: "Tools",
        url: "/tools",
        icon: BotIcon,
        items: [
            {
                title: "Repeater",
                url: "/tools/repeater",
            },
            {
                title: "Intruder",
                url: "/tools/intruder",
            },
            {
                title: "Spider",
                url: "#",
            },
            {
                title: "Decoder",
                url: "#",
            },
            {
                title: "Comparer",
                url: "#",
            },
            {
                title: "Buster",
                url: "#",
            },
            {
                title: "AI Analyzer",
                url: "#",
            },
        ],
    },
    {
        title: "Reporting",
        url: "#",
        icon: BookOpenIcon,
        items: [
            {
                title: "Site Map",
                url: "#",
            },
            {
                title: "Export Logs",
                url: "#",
            },
        ],
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings2Icon,
        items: [
            {
                title: "Keys",
                url: "#",
            },
            {
                title: "Project Options",
                url: "#",
            },
            {
                title: "User Options",
                url: "#",
            },
            {
                title: "Storage",
                url: "#",
            },
        ],
    },
];

interface SidebarItemProps {
    collapsed: boolean
    onToggle: () => void
}

const Sidebar = ({ collapsed, onToggle }: SidebarItemProps) => {
    return (
        <aside className={cn(
            "h-full flex flex-col bg-sidebar border-r py-4 transition-all duration-200",
            collapsed ? "px-2" : "px-3"
          )}>
            {sidebarItems.map((item) => {
                return (
                    <div 
                        className="flex flex-col group" 
                        key={item.title}
                        data-collapsed="false"
                    >
                        <Tooltip delayDuration={200}>
                            <TooltipTrigger asChild>
                            <Link
                                to={item.url}
                                className={cn(
                                "flex items-center hover:bg-sidebar-accent rounded-lg",
                                collapsed ? "justify-center p-2" : "w-full justify-start px-2"
                                )}
                                onClick={(e) => {
                                    if (collapsed) return; // don't toggle sections when minimized
                                    const container = e.currentTarget.closest(".group");
                                    if (container) {
                                        const curr = container.getAttribute("data-collapsed");
                                        container.setAttribute("data-collapsed", curr === "true" ? "false" : "true");
                                    }
                                    }
                                }
                            >
                                {item.icon && <item.icon size={18} />}
                                {!collapsed && (
                                <>
                                    <span className="font-inter py-1.5 px-1 flex-1">{item.title}</span>
                                    <ChevronRight
                                    className="ml-auto transition-transform duration-200 group-data-[collapsed=true]:rotate-90"
                                    size={18}
                                    />
                                </>
                                )}
                            </Link>
                            </TooltipTrigger>
                            {collapsed && <TooltipContent side="right">{item.title}</TooltipContent>}
                        </Tooltip>
                        
                        {!collapsed && (
                            <section className="pl-8 py-1 group-data-[collapsed=false]:hidden">
                                <section className="flex flex-col gap-1 border-l pl-2 pb-1">
                                    {item.items?.map((sub) => {
                                        return (
                                            <Link to={sub.url} key={sub.title}>
                                                <button 
                                                    className="text-left font-inter text-sidebar-foreground hover:bg-sidebar-accent w-full rounded-lg py-1 px-3 flex items-center gap-2"
                                                >
                                                    {sub.title}
                                                </button>
                                            </Link>
                                        );
                                    })}
                                </section>
                            </section>
                        )}
                    </div>
                );
            })}

            <Button
                variant="ghost"
                size="icon-sm"
                className="mt-auto self-end"
                onClick={onToggle}
                aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            >
                {collapsed ? <PanelLeft /> : <PanelLeftClose />}
            </Button>
        </aside>
    );
};

export default Sidebar;

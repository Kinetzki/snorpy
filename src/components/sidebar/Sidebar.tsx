import {
    BookOpenIcon,
    BotIcon,
    ChevronRight,
    LucideIcon,
    Settings2Icon,
    TerminalSquareIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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
                url: "#",
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

const Sidebar = () => {
    const location = useLocation();
    const main = location.pathname.split("/")[1];

    useEffect(() => {
        console.log(location.pathname);
    }, [location]);

    return (
        <aside className="h-full flex flex-col bg-sidebar border-r py-4 px-3">
            {sidebarItems.map((item) => {
                return (
                    <div 
                        className="flex flex-col group" 
                        key={item.title}
                        data-collapsed="false"
                    >
                        <Link
                            to={item.url}
                            className="flex text-left items-center w-full justify-start hover:bg-sidebar-accent rounded-lg px-2"
                            onClick={(e) => {
                                const container = e.currentTarget.closest('.group');
                                if (container) {
                                    const currAttribute = container.getAttribute('data-collapsed');
                                    container.setAttribute("data-collapsed", currAttribute === 'true' ? 'false' : 'true');
                                }
                            }}
                        >
                            <button
                                className="text-left font-inter  w-full  py-1.5 px-1 flex items-center gap-2"
                            >
                                <span>{item.icon && <item.icon size={18}/>}</span>
                                {item.title}
                            </button>
                            <ChevronRight
                                data-state={`/${main}` === item.url ? "open" : "close"}
                                className="ml-auto transition-transform duration-200 group-data-[collapsed=true]:rotate-90" size={18}/>
                        </Link>

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
                    </div>
                );
            })}
        </aside>
    );
};

export default Sidebar;

import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { useLocation } from "react-router-dom";

const BreadCrumbHeader:React.FC = () => {
    const { pathname } = useLocation();
    const pathSegments = pathname.split("/").filter((segment) => segment !== "")

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-7"
                />
                <Breadcrumb>
                    <BreadcrumbList>
                        {pathSegments.map((path, i) => {
                          const label = path.charAt(0).toUpperCase() + path.slice(1);
                          const isLast = i === pathSegments.length - 1;
                          return (
                            <React.Fragment key={i}>
                              <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    {label}
                                </BreadcrumbLink>
                              </BreadcrumbItem>
                              {!isLast && (
                                <BreadcrumbSeparator className="hidden md:block" />
                              )}
                            </React.Fragment>
                          )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    );
};

export default BreadCrumbHeader;

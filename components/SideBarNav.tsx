"use client";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon, SettingsIcon, ChevronRightIcon } from "lucide-react";

export default function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const isSettingsRoute = pathname.startsWith("/settings");

  return (
    <Sidebar>
      <SidebarHeader className="font-semibold font-hanken text-4xl">
        Beacon
      </SidebarHeader>
      <SidebarContent>
        <div className="px-2 pt-2">
          <Button asChild className="w-full justify-start gap-2">
            <Link href="/incidents/new">
              <PlusIcon className="size-4" />
              New Incident
            </Link>
          </Button>
        </div>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                <Link href="/dashboard">Dashboard</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/incidents")}
              >
                <Link href="/incidents">Incidents</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible
              defaultOpen={isSettingsRoute}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton isActive={isSettingsRoute}>
                    <SettingsIcon className="size-4" />
                    Settings
                    <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === "/settings/account"}
                      >
                        <Link href="/settings/account">My Account</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname === "/settings/team"}
                      >
                        <Link href="/settings/team">Team Members</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    {isAdmin && (
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === "/settings/services"}
                        >
                          <Link href="/settings/services">Services</Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

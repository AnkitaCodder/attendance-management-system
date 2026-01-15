import { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  Clock, 
  Calendar,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Live Tracking",
    url: "/tracking",
    icon: Clock,
    badge: "Live",
  },
  {
    title: "Team Directory",
    url: "/team",
    icon: Users,
    badge: null,
  },
  {
    title: "Calendar View",
    url: "/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
    badge: "Pro",
  },
];

const adminItems = [
  {
    title: "Reports",
    url: "/reports",
    icon: TrendingUp,
    badge: null,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    badge: null,
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location.pathname === path;
  const isExpanded = navigationItems.some((item) => isActive(item.url));
  
  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground shadow-sm font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={`border-r border-border/50 ${collapsed ? "w-16" : "w-72"} transition-all duration-300`}>
      <SidebarContent className="bg-gradient-surface">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-xl shadow-elevated">
              <Clock className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold text-foreground">Pioneer</h1>
                <p className="text-sm text-muted-foreground">Attendance Pro</p>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/30 border-0 focus:bg-background transition-colors"
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {!collapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 rounded-full transition-all duration-200">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200
                        ${getNavClassName({ isActive })}
                        ${isActive ? 'interactive-sm' : 'hover:interactive-sm'}
                      `}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="font-medium">{item.title}</span>
                          {item.badge && (
                            <span className={`
                              ml-auto px-2 py-1 text-xs font-medium rounded-full
                              ${item.badge === 'Live' 
                                ? 'bg-success/10 text-success border border-success/20' 
                                : 'bg-warning/10 text-warning border border-warning/20'
                              }
                            `}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup className="px-4 py-6 border-t border-border/50">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {!collapsed ? "Management" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 rounded-full">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => `
                        flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200
                        ${getNavClassName({ isActive })}
                        ${isActive ? 'interactive-sm' : 'hover:interactive-sm'}
                      `}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                © 2024 TeamTick Pro
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
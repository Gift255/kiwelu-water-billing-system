import { useState } from "react";
import { 
  Home, 
  Users, 
  Gauge, 
  FileText, 
  DollarSign, 
  BarChart3, 
  Settings,
  User,
  Calculator,
  Bell
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface SidebarItem {
  title: string;
  url: string;
  icon: any;
  permission: string;
}

const navigationItems: SidebarItem[] = [
  { title: "Dashboard", url: "/", icon: Home, permission: "all" },
  { title: "Customers", url: "/customers", icon: Users, permission: "customers_view" },
  { title: "Meter Readings", url: "/readings", icon: Gauge, permission: "readings" },
  { title: "Billing", url: "/billing", icon: Calculator, permission: "billing" },
  { title: "Billing & Payments", url: "/invoices", icon: FileText, permission: "invoices" },
  { title: "Reports", url: "/reports", icon: BarChart3, permission: "reports" },
  { title: "Notifications", url: "/notifications", icon: Bell, permission: "all" },
  { title: "Settings", url: "/settings", icon: Settings, permission: "all" },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { hasPermission, user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  const filteredItems = navigationItems.filter(item => 
    hasPermission(item.permission)
  );

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Gauge className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sm text-primary">Kiwelu Water</h2>
              <p className="text-xs text-muted-foreground">Billing System</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"} 
                      className={getNavCls}
                    >
                      <item.icon className="w-4 h-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="p-3 space-y-2">
                <div className="text-xs text-muted-foreground">Active Customers</div>
                <div className="text-lg font-semibold text-primary">1,247</div>
                <div className="text-xs text-muted-foreground">This Month</div>
                <div className="text-sm font-medium text-success">+5.2%</div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <div className="p-4 border-t mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.role.replace('_', ' ').toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CheckSquare, 
  FileText, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/components/ui/sonner";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAppContext();

  const links = [
    { path: "/", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { path: "/tasks", label: "Tasks", icon: <CheckSquare className="h-5 w-5" /> },
    { path: "/finance", label: "Finance", icon: <DollarSign className="h-5 w-5" /> },
    { path: "/members", label: "Members", icon: <Users className="h-5 w-5" /> },
    { path: "/documents", label: "Documents", icon: <FileText className="h-5 w-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    // In a real app, this would handle actual sign out logic
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        {!collapsed && (
          <div className="font-semibold text-xl text-primary">
            Grace Church
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      <div className="p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img 
                src={currentUser.avatar || "https://i.pravatar.cc/150?img=1"} 
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium text-sm">{`${currentUser.firstName} ${currentUser.lastName}`}</div>
              <div className="text-xs text-muted-foreground">{currentUser.role}</div>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mb-6">
            <div className="h-10 w-10 rounded-full overflow-hidden">
              <img 
                src={currentUser.avatar || "https://i.pravatar.cc/150?img=1"} 
                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="px-2 space-y-1">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => cn(
                  "sidebar-item",
                  isActive ? "active" : "",
                  collapsed && "justify-center px-0"
                )}
                end={link.path === "/"} // Mark as active only if exact path match for home
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <Button 
          variant="ghost" 
          className={cn(
            "sidebar-item text-red-500 hover:bg-red-50 hover:text-red-600 w-full justify-start",
            collapsed && "justify-center px-0"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

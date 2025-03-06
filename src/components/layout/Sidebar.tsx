
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Menu,
  Home,
  Users,
  DollarSign,
  CheckSquare,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { toast } from "@/lib/toast";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser } = useAppContext();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleSignOut = () => {
    toast.success("Signed out successfully");
    // In a real application, this would handle the actual sign-out logic
  };

  return (
    <aside className={cn(
      "h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
      collapsed ? "w-[70px]" : "w-[250px]"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center">
            <svg className="w-8 h-8 text-sidebar-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L3 9V21H9V14H15V21H21V9L12 4Z" fill="currentColor" />
            </svg>
            <span className="ml-2 font-semibold text-lg">Church Manager</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="space-y-1 px-3">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <LayoutDashboard size={20} />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>
          
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <CheckSquare size={20} />
            {!collapsed && <span>Tasks</span>}
          </NavLink>
          
          <NavLink
            to="/members"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <Users size={20} />
            {!collapsed && <span>Members</span>}
          </NavLink>
          
          <NavLink
            to="/finance"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <DollarSign size={20} />
            {!collapsed && <span>Finance</span>}
          </NavLink>
          
          <NavLink
            to="/documents"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <FileText size={20} />
            {!collapsed && <span>Documents</span>}
          </NavLink>
          
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn("sidebar-item", isActive && "active")
            }
          >
            <Settings size={20} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </div>
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <button 
          onClick={handleSignOut}
          className={cn(
            "sidebar-item w-full justify-center",
            collapsed ? "px-0" : ""
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;


import React, { useState } from "react";
import { Bell, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import { formatDistance } from "date-fns";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC = () => {
  const { notifications, markNotificationAsRead, currentUser } = useAppContext();
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    setShowNotifications(false);
    if (notification.targetUrl) {
      navigate(notification.targetUrl);
    }
  };

  return (
    <header className="h-16 border-b border-border flex items-center px-6 bg-background">
      <div className="flex-1">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search..." 
            className="pl-10 h-9 w-60 lg:w-80 bg-muted/60"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[calc(100vh-10rem)] overflow-y-auto">
            <div className="p-2 font-medium">Notifications</div>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem 
                  key={notification.id}
                  className="p-3 cursor-pointer"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start">
                    <div className={`h-2 w-2 mt-1.5 rounded-full mr-2 ${notification.read ? 'bg-transparent' : 'bg-primary'}`} />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-xs text-muted-foreground ml-2">
                          {formatDistance(new Date(notification.createdAt), new Date(), { addSuffix: true })}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">{notification.message}</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full overflow-hidden">
                <img 
                  src={currentUser.avatar || "https://i.pravatar.cc/150?img=1"} 
                  alt={`${currentUser.firstName} ${currentUser.lastName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden md:inline-block">{currentUser.firstName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;

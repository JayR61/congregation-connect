
import React, { useState } from "react";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppContext } from "@/context/AppContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Topbar = () => {
  const { currentUser, notifications = [] } = useAppContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const unreadNotifications = notifications?.filter(n => !n.read) || [];

  // Handle the case when currentUser is null
  const defaultUser = {
    firstName: "Guest",
    lastName: "User",
    email: "guest@example.com",
    avatar: undefined
  };
  
  const user = currentUser || defaultUser;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const userInitials = getInitials(`${user.firstName} ${user.lastName}`);

  const handleNotificationClick = (id: string) => {
    // This is a placeholder - we'll implement the real functionality later
    console.log("Notification clicked:", id);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 py-2">
      <div className="flex items-center">
        {isSearchOpen ? (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search..."
              className="border border-input rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 w-[300px]"
              autoFocus
              onBlur={() => setIsSearchOpen(false)}
            />
          </div>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
            <Search size={20} />
          </Button>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications?.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`cursor-pointer ${!notification.read ? 'bg-accent/10 font-medium' : ''}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex flex-col space-y-1 w-full">
                    <div className="flex justify-between">
                      <span className="font-medium">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No notifications
              </div>
            )}
            {notifications?.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-center text-primary">
                  View all notifications
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src={user.avatar || undefined} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{`${user.firstName} ${user.lastName}`}</span>
                <span className="text-xs text-muted-foreground">{user.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Topbar;

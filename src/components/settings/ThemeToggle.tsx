
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Sun className="h-4 w-4 text-muted-foreground" />
      <Switch 
        checked={theme === "dark"} 
        onCheckedChange={toggleTheme} 
        aria-label="Toggle dark mode"
      />
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}

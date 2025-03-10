
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sun, Moon, Globe } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export function AppearanceSettings() {
  const { 
    theme, 
    compactView, 
    fontSize, 
    accentColor, 
    language,
    setTheme, 
    setCompactView, 
    setFontSize, 
    setAccentColor, 
    setLanguage 
  } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how the application looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="block mb-1">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-muted-foreground" />
              <Switch
                id="dark-mode"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compact-view" className="block mb-1">Compact View</Label>
              <p className="text-sm text-muted-foreground">Reduce spacing to fit more content</p>
            </div>
            <Switch
              id="compact-view"
              checked={compactView}
              onCheckedChange={setCompactView}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="font-size">Font Size</Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={fontSize === 'small' ? 'default' : 'outline'}
                onClick={() => setFontSize('small')}
                className="flex-1"
              >
                Small
              </Button>
              <Button
                type="button"
                variant={fontSize === 'medium' ? 'default' : 'outline'}
                onClick={() => setFontSize('medium')}
                className="flex-1"
              >
                Medium
              </Button>
              <Button
                type="button"
                variant={fontSize === 'large' ? 'default' : 'outline'}
                onClick={() => setFontSize('large')}
                className="flex-1"
              >
                Large
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { name: 'blue', color: 'bg-blue-500' },
                { name: 'green', color: 'bg-green-500' },
                { name: 'purple', color: 'bg-purple-500' },
                { name: 'red', color: 'bg-red-500' }
              ].map((colorOption) => (
                <Button
                  key={colorOption.name}
                  type="button"
                  variant="outline"
                  className={`h-10 ${colorOption.color} ${accentColor === colorOption.name ? 'ring-2 ring-offset-2 ring-foreground' : ''}`}
                  onClick={() => setAccentColor(colorOption.name as any)}
                  aria-label={`${colorOption.name} theme`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="block mb-1">Language</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred language</p>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select 
                className="border rounded px-2 py-1"
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

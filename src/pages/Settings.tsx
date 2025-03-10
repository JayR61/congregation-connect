
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  User, Building, Bell, PaintBucket, Mail, Phone, 
  MapPin, Clock, Moon, Sun, Save, Globe, Settings as SettingsIcon
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { useSettings, AccentColor, FontSize, Language } from '@/context/SettingsContext';
import { toast } from '@/lib/toast';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import ChangePasswordDialog from '@/components/settings/ChangePasswordDialog';
import TwoFactorAuthDialog from '@/components/settings/TwoFactorAuthDialog';
import FileUploadField from '@/components/settings/FileUploadField';

const Settings = () => {
  const { currentUser } = useAppContext();
  const { theme } = useTheme();
  const { 
    notifications, updateNotificationSetting, saveNotificationSettings,
    appearance, updateAppearanceSetting,
    churchInfo, updateChurchInfo, saveChurchInfo
  } = useSettings();
  
  const [profileForm, setProfileForm] = useState({
    name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`,
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  });
  
  // Apply compact view class to body when it changes
  useEffect(() => {
    const body = document.body;
    if (appearance.compactView) {
      body.classList.add('compact-view');
    } else {
      body.classList.remove('compact-view');
    }
  }, [appearance.compactView]);
  
  // Apply accent color when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', appearance.accentColor);
    
    // Update CSS variables based on the accent color
    const accentColorMap = {
      blue: {
        light: '#3b82f6',
        dark: '#60a5fa',
      },
      green: {
        light: '#22c55e',
        dark: '#4ade80',
      },
      purple: {
        light: '#8b5cf6',
        dark: '#a78bfa',
      },
      red: {
        light: '#ef4444',
        dark: '#f87171',
      },
    };
    
    const color = accentColorMap[appearance.accentColor];
    document.documentElement.style.setProperty(
      '--accent-color', 
      theme === 'dark' ? color.dark : color.light
    );
  }, [appearance.accentColor, theme]);
  
  // Apply font size when it changes
  useEffect(() => {
    const fontSizeMap = {
      small: '0.875rem',
      medium: '1rem',
      large: '1.125rem',
    };
    
    document.documentElement.style.fontSize = fontSizeMap[appearance.fontSize];
  }, [appearance.fontSize]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save to the backend
    toast.success("Profile updated successfully");
  };

  const handleChurchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveChurchInfo();
    toast.success("Church information updated successfully");
  };

  const handleLogoUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        updateChurchInfo('logo', e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    updateNotificationSetting(key, !notifications[key]);
    saveNotificationSettings();
    toast.success(`${key} setting updated`);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateAppearanceSetting('language', e.target.value as Language);
    toast.success("Language setting updated");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="church" className="flex items-center">
            <Building className="mr-2 h-4 w-4" /> Church Info
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center">
            <PaintBucket className="mr-2 h-4 w-4" /> Appearance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 space-y-2">
                      <Label htmlFor="profile-name">Full Name</Label>
                      <Input
                        id="profile-name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    <div className="md:w-1/3 space-y-2">
                      <Label htmlFor="profile-email">Email</Label>
                      <Input
                        id="profile-email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    <div className="md:w-1/3 space-y-2">
                      <Label htmlFor="profile-phone">Phone</Label>
                      <Input
                        id="profile-phone"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-bio">Bio</Label>
                    <Textarea
                      id="profile-bio"
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      placeholder="Tell us about yourself"
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Account Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ChangePasswordDialog />
                      <TwoFactorAuthDialog />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="church">
          <Card>
            <CardHeader>
              <CardTitle>Church Information</CardTitle>
              <CardDescription>
                Update your church details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChurchSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="church-name">Church Name</Label>
                      <Input
                        id="church-name"
                        value={churchInfo.name}
                        onChange={(e) => updateChurchInfo('name', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="church-website">Website</Label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                          https://
                        </span>
                        <Input
                          id="church-website"
                          value={churchInfo.website}
                          onChange={(e) => updateChurchInfo('website', e.target.value)}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-address">Address</Label>
                    <Textarea
                      id="church-address"
                      value={churchInfo.address}
                      onChange={(e) => updateChurchInfo('address', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="church-email">Email</Label>
                      <div className="flex">
                        <Mail className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="church-email"
                          type="email"
                          value={churchInfo.email}
                          onChange={(e) => updateChurchInfo('email', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="church-phone">Phone</Label>
                      <div className="flex">
                        <Phone className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="church-phone"
                          value={churchInfo.phone}
                          onChange={(e) => updateChurchInfo('phone', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-logo">Church Logo</Label>
                    <FileUploadField
                      onFileChange={handleLogoUpload}
                      label="Upload New Logo"
                      preview={churchInfo.logo}
                      icon={<Building className="h-8 w-8 text-muted-foreground" />}
                      accept="image/*"
                      maxSize={2}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">
                      <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Delivery Methods</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.emailNotifications}
                      onCheckedChange={() => handleNotificationChange('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.pushNotifications}
                      onCheckedChange={() => handleNotificationChange('pushNotifications')}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notification Types</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="task-reminders" className="block mb-1">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming tasks and deadlines</p>
                    </div>
                    <Switch
                      id="task-reminders"
                      checked={notifications.taskReminders}
                      onCheckedChange={() => handleNotificationChange('taskReminders')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="event-reminders" className="block mb-1">Event Reminders</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming church events</p>
                    </div>
                    <Switch
                      id="event-reminders"
                      checked={notifications.eventReminders}
                      onCheckedChange={() => handleNotificationChange('eventReminders')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-digest" className="block mb-1">Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Receive a weekly summary of church activities</p>
                    </div>
                    <Switch
                      id="weekly-digest"
                      checked={notifications.weeklyDigest}
                      onCheckedChange={() => handleNotificationChange('weeklyDigest')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
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
                  <ThemeToggle />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="compact-view" className="block mb-1">Compact View</Label>
                    <p className="text-sm text-muted-foreground">Reduce spacing to fit more content</p>
                  </div>
                  <Switch
                    id="compact-view"
                    checked={appearance.compactView}
                    onCheckedChange={(checked) => updateAppearanceSetting('compactView', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={appearance.fontSize === 'small' ? 'default' : 'outline'}
                      onClick={() => updateAppearanceSetting('fontSize', 'small')}
                      className="flex-1"
                    >
                      Small
                    </Button>
                    <Button
                      type="button"
                      variant={appearance.fontSize === 'medium' ? 'default' : 'outline'}
                      onClick={() => updateAppearanceSetting('fontSize', 'medium')}
                      className="flex-1"
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      variant={appearance.fontSize === 'large' ? 'default' : 'outline'}
                      onClick={() => updateAppearanceSetting('fontSize', 'large')}
                      className="flex-1"
                    >
                      Large
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['blue', 'green', 'purple', 'red'].map((color) => (
                      <Button
                        key={color}
                        type="button"
                        variant="outline"
                        className={`h-10 ${appearance.accentColor === color ? 'ring-2 ring-ring ring-offset-2' : ''}`}
                        style={{ 
                          backgroundColor: color, 
                          color: 'white',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                        onClick={() => updateAppearanceSetting('accentColor', color as AccentColor)}
                        aria-label={`${color} theme`}
                      >
                        {appearance.accentColor === color && (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        )}
                      </Button>
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
                      className="border rounded px-3 py-2 bg-background"
                      value={appearance.language}
                      onChange={handleLanguageChange}
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;

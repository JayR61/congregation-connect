import { useState } from 'react';
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
  MapPin, Clock, Moon, Sun, Save, Globe
} from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/lib/toast';

const Settings = () => {
  const { currentUser } = useAppContext();
  const [profileForm, setProfileForm] = useState({
    name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`,
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  });
  
  const [churchForm, setChurchForm] = useState({
    name: 'Grace Community Church',
    address: '123 Main Street, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'info@gracechurch.org',
    website: 'www.gracechurch.org',
    logo: '',
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    eventReminders: true,
    weeklyDigest: false,
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: false,
    compactView: false,
    fontSize: 'medium',
    accentColor: 'blue',
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save to the backend
    toast.success("Profile updated successfully");
  };

  const handleChurchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save to the backend
    toast.success("Church information updated successfully");
  };

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key],
    });
    toast.success(`Setting updated`);
  };

  const handleAppearanceChange = (key: keyof typeof appearanceSettings, value: any) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [key]: value,
    });
    toast.success(`Setting updated`);
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
                      <Button variant="outline" type="button">
                        Change Password
                      </Button>
                      <Button variant="outline" type="button">
                        Enable Two-Factor Authentication
                      </Button>
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
                        value={churchForm.name}
                        onChange={(e) => setChurchForm({...churchForm, name: e.target.value})}
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
                          value={churchForm.website}
                          onChange={(e) => setChurchForm({...churchForm, website: e.target.value})}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-address">Address</Label>
                    <Textarea
                      id="church-address"
                      value={churchForm.address}
                      onChange={(e) => setChurchForm({...churchForm, address: e.target.value})}
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
                          value={churchForm.email}
                          onChange={(e) => setChurchForm({...churchForm, email: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="church-phone">Phone</Label>
                      <div className="flex">
                        <Phone className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                        <Input
                          id="church-phone"
                          value={churchForm.phone}
                          onChange={(e) => setChurchForm({...churchForm, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="church-logo">Church Logo</Label>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                        <Building className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <Button variant="outline" type="button">
                        Upload New Logo
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recommended size: 512x512px. Max file size: 2MB.
                    </p>
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
                      checked={notificationSettings.emailNotifications}
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
                      checked={notificationSettings.pushNotifications}
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
                      checked={notificationSettings.taskReminders}
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
                      checked={notificationSettings.eventReminders}
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
                      checked={notificationSettings.weeklyDigest}
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
                  <div className="flex items-center space-x-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      id="dark-mode"
                      checked={appearanceSettings.darkMode}
                      onCheckedChange={(checked) => handleAppearanceChange('darkMode', checked)}
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
                    checked={appearanceSettings.compactView}
                    onCheckedChange={(checked) => handleAppearanceChange('compactView', checked)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="font-size">Font Size</Label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={appearanceSettings.fontSize === 'small' ? 'default' : 'outline'}
                      onClick={() => handleAppearanceChange('fontSize', 'small')}
                      className="flex-1"
                    >
                      Small
                    </Button>
                    <Button
                      type="button"
                      variant={appearanceSettings.fontSize === 'medium' ? 'default' : 'outline'}
                      onClick={() => handleAppearanceChange('fontSize', 'medium')}
                      className="flex-1"
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      variant={appearanceSettings.fontSize === 'large' ? 'default' : 'outline'}
                      onClick={() => handleAppearanceChange('fontSize', 'large')}
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
                        className={`h-10 ${appearanceSettings.accentColor === color ? 'ring-2 ring-offset-2' : ''}`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleAppearanceChange('accentColor', color)}
                        aria-label={`${color} theme`}
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
                    <select className="border rounded px-2 py-1">
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

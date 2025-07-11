
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Bell } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export function NotificationSettings() {
  const {
    notificationSettings,
    updateNotificationSetting
  } = useSettings();

  const handleNotificationChange = (key: keyof typeof notificationSettings) => {
    updateNotificationSetting(key, !notificationSettings[key]);
  };

  return (
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
  );
}

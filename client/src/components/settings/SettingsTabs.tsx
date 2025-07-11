
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Building, Bell, PaintBucket } from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { ChurchInfoSettings } from './ChurchInfoSettings';
import { NotificationSettings } from './NotificationSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { TwoFactorAuthDialog } from './TwoFactorAuthDialog';

export function SettingsTabs() {
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);

  return (
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
        <ProfileSettings 
          onPasswordDialogOpen={() => setIsPasswordDialogOpen(true)}
          on2FADialogOpen={() => setIs2FADialogOpen(true)}
        />
      </TabsContent>
      
      <TabsContent value="church">
        <ChurchInfoSettings />
      </TabsContent>
      
      <TabsContent value="notifications">
        <NotificationSettings />
      </TabsContent>
      
      <TabsContent value="appearance">
        <AppearanceSettings />
      </TabsContent>

      <ChangePasswordDialog 
        open={isPasswordDialogOpen} 
        onOpenChange={setIsPasswordDialogOpen} 
      />
      
      <TwoFactorAuthDialog 
        open={is2FADialogOpen} 
        onOpenChange={setIs2FADialogOpen} 
      />
    </Tabs>
  );
}

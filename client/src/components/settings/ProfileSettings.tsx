
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Save, Shield } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAppContext } from '@/context/AppContext';

interface ProfileSettingsProps {
  onPasswordDialogOpen: () => void;
  on2FADialogOpen: () => void;
}

export function ProfileSettings({ onPasswordDialogOpen, on2FADialogOpen }: ProfileSettingsProps) {
  const { currentUser } = useAppContext();
  
  const [profileForm, setProfileForm] = useState({
    name: `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`,
    email: currentUser?.email || '',
    phone: '',
    bio: '',
  });
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would save to the backend
    toast.success("Profile updated successfully");
  };

  return (
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
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={onPasswordDialogOpen}
                >
                  <Shield className="mr-2 h-4 w-4" /> Change Password
                </Button>
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={on2FADialogOpen}
                >
                  <Shield className="mr-2 h-4 w-4" /> Enable Two-Factor Authentication
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
  );
}

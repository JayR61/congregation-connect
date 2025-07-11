
import { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Upload, Building, Save } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { toast } from '@/lib/toast';

export function ChurchInfoSettings() {
  const {
    churchInfo,
    updateChurchInfo,
    uploadChurchLogo,
  } = useSettings();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: churchInfo.name,
    address: churchInfo.address,
    phone: churchInfo.phone,
    email: churchInfo.email,
    website: churchInfo.website,
  });

  // Update form data when church info changes
  useEffect(() => {
    setFormData({
      name: churchInfo.name,
      address: churchInfo.address,
      phone: churchInfo.phone,
      email: churchInfo.email,
      website: churchInfo.website,
    });
  }, [churchInfo]);

  const handleChurchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateChurchInfo(formData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }
    
    try {
      await uploadChurchLogo(file);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };
  
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="rounded-l-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="church-address">Address</Label>
              <Textarea
                id="church-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="church-phone">Phone</Label>
                <div className="flex">
                  <Phone className="mr-2 h-4 w-4 mt-3 text-muted-foreground" />
                  <Input
                    id="church-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="church-logo">Church Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                  {churchInfo.logo ? (
                    <img 
                      src={churchInfo.logo} 
                      alt="Church logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <Button variant="outline" type="button" onClick={triggerFileUpload}>
                  <Upload className="mr-2 h-4 w-4" /> Upload New Logo
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
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
  );
}

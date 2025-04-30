import { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SocialMediaAccount } from "@/types";
import { toast } from '@/lib/toast';
import { Facebook, Instagram, Twitter, Youtube, Globe, LinkIcon, User, Users, Calendar, TrendingUp, ExternalLink, BarChart2, Settings2, Search, Plus } from "lucide-react";

const SocialMedia = () => {
  const { currentUser } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<SocialMediaAccount[]>([
    {
      id: 'sm-1',
      platform: 'facebook',
      handle: 'churchorganizationpage',
      url: 'https://facebook.com/churchorganizationpage',
      followers: 1250,
      lastUpdated: new Date('2023-06-15'),
      responsible: currentUser?.firstName + ' ' + currentUser?.lastName,
      status: 'active'
    },
    {
      id: 'sm-2',
      platform: 'instagram',
      handle: 'churchorganization',
      url: 'https://instagram.com/churchorganization',
      followers: 850,
      lastUpdated: new Date('2023-06-20'),
      responsible: currentUser?.firstName + ' ' + currentUser?.lastName,
      status: 'active'
    },
    {
      id: 'sm-3',
      platform: 'youtube',
      handle: 'Church Organization',
      url: 'https://youtube.com/@churchorganization',
      followers: 450,
      lastUpdated: new Date('2023-05-30'),
      responsible: currentUser?.firstName + ' ' + currentUser?.lastName,
      status: 'inactive'
    }
  ]);
  
  const [formData, setFormData] = useState<Partial<SocialMediaAccount>>({
    platform: '',
    handle: '',
    url: '',
    followers: 0,
    responsible: currentUser?.firstName + ' ' + currentUser?.lastName,
    status: 'active'
  });
  
  const handleAddAccount = () => {
    if (!formData.platform || !formData.handle || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newAccount: SocialMediaAccount = {
      id: `sm-${Date.now()}`,
      platform: formData.platform,
      handle: formData.handle,
      url: formData.url,
      followers: formData.followers || 0,
      lastUpdated: new Date(),
      responsible: formData.responsible || '',
      status: formData.status as 'active' | 'inactive'
    };
    
    setSocialMediaAccounts(prev => [...prev, newAccount]);
    toast.success('Social media account added');
    setIsDialogOpen(false);
    setFormData({
      platform: '',
      handle: '',
      url: '',
      followers: 0,
      responsible: currentUser?.firstName + ' ' + currentUser?.lastName,
      status: 'active'
    });
  };
  
  const filteredAccounts = socialMediaAccounts.filter(account => {
    if (!searchQuery) return true;
    
    return (
      account.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.responsible.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Helper function to get appropriate icon for social platform
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'twitter':
      case 'x':
        return <Twitter className="h-5 w-5 text-sky-500" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      default:
        return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  // Helper function to get color class for platform
  const getPlatformColorClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'bg-blue-100 text-blue-800';
      case 'instagram':
        return 'bg-pink-100 text-pink-800';
      case 'twitter':
      case 'x':
        return 'bg-sky-100 text-sky-800';
      case 'youtube':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Rest of the component
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Social Media Management</h1>
          <p className="text-muted-foreground">Manage your church's social media presence</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 md:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Social Media Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Social Media Account</DialogTitle>
              <DialogDescription>
                Add a new social media platform for your church
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="platform" className="text-right">Platform</Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.platform} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="handle" className="text-right">Handle/Username</Label>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                  className="col-span-3"
                  placeholder="@churchhandle"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="url" className="text-right">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="col-span-3"
                  placeholder="https://platform.com/yourchurch"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="followers" className="text-right">Followers</Label>
                <Input
                  id="followers"
                  type="number"
                  value={formData.followers?.toString() || '0'}
                  onChange={(e) => setFormData(prev => ({ ...prev, followers: parseInt(e.target.value) || 0 }))}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="responsible" className="text-right">Responsible Person</Label>
                <Input
                  id="responsible"
                  value={formData.responsible}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsible: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <div className="col-span-3">
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'active' | 'inactive' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddAccount}>Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search social media accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(account => (
            <Card key={account.id} className="overflow-hidden">
              <div className={`h-2 w-full ${account.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {getPlatformIcon(account.platform)}
                    <CardTitle className="ml-2">
                      {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)}
                    </CardTitle>
                  </div>
                  <Badge className={getPlatformColorClass(account.platform)}>
                    {account.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription className="flex items-center mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>@{account.handle}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a
                      href={account.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline overflow-hidden overflow-ellipsis"
                    >
                      {account.url}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{account.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Last updated: {new Date(account.lastUpdated).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Managed by: {account.responsible}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 border-t flex justify-between">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <BarChart2 className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Visit
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings2 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No social media accounts found</h3>
            <p className="text-muted-foreground mb-4">Add your first social media account to start tracking</p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Social Media Account
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialMedia;

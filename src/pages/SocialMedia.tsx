
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { SocialMediaAccount } from '@/types';
import { toast } from '@/lib/toast';

const SocialMedia = () => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([
    {
      id: "1",
      platform: "Facebook",
      username: "churchchannel",
      url: "https://facebook.com/churchchannel",
      followers: 5200,
      posts: 342,
      engagement: 3.5,
      status: "active",
      createdAt: new Date(),
      handle: "@churchchannel",
      responsible: "John Doe"
    },
    {
      id: "2",
      platform: "Instagram",
      username: "church_photos",
      url: "https://instagram.com/church_photos",
      followers: 3800,
      posts: 215,
      engagement: 4.2,
      status: "active",
      createdAt: new Date(),
      handle: "@church_photos",
      responsible: "Jane Smith"
    },
    {
      id: "3",
      platform: "Twitter",
      username: "church_updates",
      url: "https://twitter.com/church_updates",
      followers: 2100,
      posts: 1240,
      engagement: 2.1,
      status: "active",
      createdAt: new Date(),
      handle: "@church_updates",
      responsible: "Mike Johnson"
    }
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState<Partial<SocialMediaAccount>>({
    platform: "",
    username: "",
    url: "",
    status: "active",
    handle: "",
    responsible: ""
  });
  
  const handleAddAccount = () => {
    if (!newAccount.platform || !newAccount.username || !newAccount.url) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const account: SocialMediaAccount = {
      id: `account-${Date.now()}`,
      platform: newAccount.platform,
      username: newAccount.username,
      url: newAccount.url,
      status: newAccount.status || "active",
      createdAt: new Date(),
      handle: newAccount.handle || "",
      responsible: newAccount.responsible || ""
    };
    
    setAccounts([...accounts, account]);
    setNewAccount({
      platform: "",
      username: "",
      url: "",
      status: "active",
      handle: "",
      responsible: ""
    });
    setIsDialogOpen(false);
    toast.success("Social media account added successfully");
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Social Media Management</h1>
        <Button onClick={() => setIsDialogOpen(true)}>Add Account</Button>
      </div>
      
      <Tabs defaultValue="accounts">
        <TabsList>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="content">Content Calendar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <Card key={account.id}>
                <CardHeader>
                  <CardTitle>{account.platform}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Username:</strong> {account.username}</p>
                    <p><strong>Handle:</strong> {account.handle}</p>
                    <p><strong>Managed by:</strong> {account.responsible}</p>
                    <p><strong>URL:</strong> <a href={account.url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{account.url}</a></p>
                    <p><strong>Followers:</strong> {account.followers?.toLocaleString()}</p>
                    <p><strong>Posts:</strong> {account.posts?.toLocaleString()}</p>
                    <p><strong>Engagement Rate:</strong> {account.engagement}%</p>
                    <p><strong>Status:</strong> <span className={`font-medium ${account.status === 'active' ? 'text-green-500' : 'text-gray-500'}`}>{account.status}</span></p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Analytics dashboard will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Content calendar features will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Social Media Account</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Select 
                value={newAccount.platform} 
                onValueChange={(value) => setNewAccount({ ...newAccount, platform: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Facebook">Facebook</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Twitter">Twitter</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Input
                placeholder="Username"
                value={newAccount.username}
                onChange={(e) => setNewAccount({ ...newAccount, username: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Handle (e.g. @churchname)"
                value={newAccount.handle}
                onChange={(e) => setNewAccount({ ...newAccount, handle: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="URL"
                type="url"
                value={newAccount.url}
                onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
              />
            </div>
            <div>
              <Input
                placeholder="Responsible Person"
                value={newAccount.responsible}
                onChange={(e) => setNewAccount({ ...newAccount, responsible: e.target.value })}
              />
            </div>
            <div>
              <Select 
                value={newAccount.status} 
                onValueChange={(value: 'active' | 'inactive' | 'archived') => setNewAccount({ ...newAccount, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Account Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAccount}>Add Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SocialMedia;

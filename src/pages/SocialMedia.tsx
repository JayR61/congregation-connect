
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowUpRight, 
  Calendar,
  ChevronDown,
  Edit,
  Facebook,
  Globe,
  Image,
  Instagram,
  Layout,
  Link,
  Plus,
  Share,
  Twitter,
  Upload,
  Youtube
} from "lucide-react";
import { toast } from '@/lib/toast';
import { SocialMediaAccount } from '@/types';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from "@/components/ui/navigation-menu";

const SocialMedia = () => {
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Social media accounts
  const [socialAccounts, setSocialAccounts] = useState<SocialMediaAccount[]>([
    {
      platform: 'facebook',
      url: 'https://facebook.com/mychurch',
      username: 'mychurch',
      active: true
    },
    {
      platform: 'instagram',
      url: 'https://instagram.com/mychurch',
      username: 'mychurch',
      active: true
    },
    {
      platform: 'twitter',
      url: 'https://twitter.com/mychurch',
      username: 'mychurch',
      active: false
    },
    {
      platform: 'website',
      url: 'https://mychurch.org',
      active: true
    }
  ]);
  
  // Social media posts (mock data)
  const [posts, setPosts] = useState([
    {
      id: 'post1',
      platform: 'facebook',
      content: 'Join us this Sunday for a special service!',
      imageUrl: null,
      scheduledDate: new Date('2023-08-10T10:00:00'),
      status: 'scheduled',
      likes: 0,
      comments: 0,
      shares: 0
    },
    {
      id: 'post2',
      platform: 'instagram',
      content: 'Our youth group had an amazing time at the retreat last weekend! #blessed',
      imageUrl: '/placeholder.svg',
      scheduledDate: null,
      status: 'published',
      publishedDate: new Date('2023-07-30T14:00:00'),
      likes: 45,
      comments: 12,
      shares: 8
    }
  ]);
  
  // Form state
  const [accountForm, setAccountForm] = useState<Partial<SocialMediaAccount>>({
    platform: 'facebook',
    url: '',
    username: '',
    active: true
  });
  
  const [postForm, setPostForm] = useState({
    platform: 'facebook',
    content: '',
    imageUrl: null,
    scheduledDate: null,
    status: 'draft'
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return <Facebook className="h-5 w-5 text-blue-600" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-pink-600" />;
      case 'twitter':
        return <Twitter className="h-5 w-5 text-blue-400" />;
      case 'youtube':
        return <Youtube className="h-5 w-5 text-red-600" />;
      case 'website':
      default:
        return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return 'Facebook';
      case 'instagram':
        return 'Instagram';
      case 'twitter':
        return 'Twitter';
      case 'youtube':
        return 'YouTube';
      case 'website':
        return 'Website';
      default:
        return platform.charAt(0).toUpperCase() + platform.slice(1);
    }
  };

  const handleAddAccount = () => {
    if (!accountForm.platform || !accountForm.url) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAccount: SocialMediaAccount = {
      platform: accountForm.platform as any,
      url: accountForm.url,
      username: accountForm.username,
      active: accountForm.active || true
    };

    setSocialAccounts(prev => [...prev, newAccount]);
    toast.success(`${getPlatformName(newAccount.platform)} account added successfully`);
    setIsAccountDialogOpen(false);
    setAccountForm({
      platform: 'facebook',
      url: '',
      username: '',
      active: true
    });
  };

  const handleCreatePost = () => {
    if (!postForm.platform || !postForm.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      platform: postForm.platform,
      content: postForm.content,
      imageUrl: postForm.imageUrl,
      scheduledDate: postForm.scheduledDate,
      status: postForm.status,
      likes: 0,
      comments: 0,
      shares: 0
    };

    setPosts(prev => [...prev, newPost]);
    
    if (postForm.status === 'published') {
      toast.success("Post published successfully");
    } else {
      toast.success("Post scheduled successfully");
    }
    
    setIsPostDialogOpen(false);
    setPostForm({
      platform: 'facebook',
      content: '',
      imageUrl: null,
      scheduledDate: null,
      status: 'draft'
    });
  };

  const toggleAccountStatus = (index: number) => {
    setSocialAccounts(prev => prev.map((account, i) => 
      i === index ? { ...account, active: !account.active } : account
    ));
    
    const account = socialAccounts[index];
    toast.success(`${getPlatformName(account.platform)} account ${account.active ? 'deactivated' : 'activated'}`);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Social Media Management</h1>
          <p className="text-muted-foreground">Manage your church's online presence</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Social Media Account</DialogTitle>
                <DialogDescription>
                  Connect a new social media account to manage it through this platform
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="platform" className="text-right">
                    Platform
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={accountForm.platform} 
                      onValueChange={(value) => setAccountForm(prev => ({ ...prev, platform: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    value={accountForm.url}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, url: e.target.value }))}
                    className="col-span-3"
                    placeholder="https://..."
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={accountForm.username}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, username: e.target.value }))}
                    className="col-span-3"
                    placeholder="Optional"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch 
                      id="active" 
                      checked={accountForm.active}
                      onCheckedChange={(checked) => setAccountForm(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active" className="cursor-pointer">
                      {accountForm.active ? 'Account is active' : 'Account is inactive'}
                    </Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAccountDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAccount}>
                  Add Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Social Media Post</DialogTitle>
                <DialogDescription>
                  Create a post to publish or schedule on your social media accounts
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-platform" className="text-right">
                    Platform
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={postForm.platform} 
                      onValueChange={(value) => setPostForm(prev => ({ ...prev, platform: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {socialAccounts.filter(acc => acc.active).map((account) => (
                          <SelectItem key={account.url} value={account.platform}>
                            <div className="flex items-center">
                              {getPlatformIcon(account.platform)}
                              <span className="ml-2">{getPlatformName(account.platform)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="post-content" className="text-right mt-2">
                    Content
                  </Label>
                  <Textarea
                    id="post-content"
                    value={postForm.content}
                    onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                    className="col-span-3"
                    placeholder="What would you like to share?"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-image" className="text-right">
                    Image
                  </Label>
                  <div className="col-span-3">
                    <Button variant="outline" className="w-full" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="post-schedule" className="text-right">
                    Schedule
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="post-schedule"
                      type="datetime-local"
                      onChange={(e) => setPostForm(prev => ({ 
                        ...prev, 
                        scheduledDate: e.target.value ? new Date(e.target.value) : null,
                        status: e.target.value ? 'scheduled' : 'draft'
                      }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPostDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={() => {
                  setPostForm(prev => ({ ...prev, status: 'draft' }));
                  handleCreatePost();
                }}>
                  Save Draft
                </Button>
                <Button onClick={() => {
                  setPostForm(prev => ({ ...prev, status: 'published' }));
                  handleCreatePost();
                }}>
                  {postForm.scheduledDate ? 'Schedule Post' : 'Publish Now'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="accounts">Accounts</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Overview</CardTitle>
                  <CardDescription>Statistics and engagement across platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-center text-muted-foreground py-6">
                      Analytics dashboard will show engagement metrics here
                    </p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-muted rounded-md">
                        <div className="text-2xl font-bold">24</div>
                        <div className="text-xs text-muted-foreground">Total Posts</div>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <div className="text-2xl font-bold">1.2k</div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <div className="text-2xl font-bold">342</div>
                        <div className="text-xs text-muted-foreground">Comments</div>
                      </div>
                      <div className="p-4 bg-muted rounded-md">
                        <div className="text-2xl font-bold">87</div>
                        <div className="text-xs text-muted-foreground">Shares</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Detailed Analytics
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Your linked social platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {socialAccounts.map((account, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          {getPlatformIcon(account.platform)}
                          <span className="ml-2">{getPlatformName(account.platform)}</span>
                        </div>
                        <Badge variant={account.active ? "success" : "secondary"}>
                          {account.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setIsAccountDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Add Account
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Your latest social media content</CardDescription>
              </CardHeader>
              <CardContent>
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div key={post.id} className="flex border rounded-md p-4">
                        <div className="mr-4">
                          {getPlatformIcon(post.platform)}
                        </div>
                        <div className="flex-1">
                          <p className="mb-2">{post.content}</p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {post.status === 'published' ? 
                              `Published: ${formatDate(post.publishedDate || new Date())}` : 
                              `Scheduled: ${formatDate(post.scheduledDate || new Date())}`}
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <Badge variant={post.status === 'published' ? "success" : "secondary"}>
                            {post.status === 'published' ? 'Published' : 'Scheduled'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No posts yet</p>
                    <Button onClick={() => setIsPostDialogOpen(true)} className="mt-2">
                      Create Your First Post
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => setActiveTab('posts')}>
                  View All Posts
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="accounts" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {socialAccounts.map((account, index) => (
              <Card key={index} className={`hover:bg-muted/50 transition-colors ${!account.active ? 'opacity-70' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {getPlatformIcon(account.platform)}
                      <CardTitle className="ml-2 text-lg">{getPlatformName(account.platform)}</CardTitle>
                    </div>
                    <Badge variant={account.active ? "success" : "secondary"}>
                      {account.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  {account.username && (
                    <CardDescription>@{account.username}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm">
                      <Link className="h-4 w-4 mr-1 text-muted-foreground" />
                      <a 
                        href={account.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        {account.url}
                        <ArrowUpRight className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm font-bold">245</div>
                        <div className="text-xs text-muted-foreground">Posts</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm font-bold">1.5k</div>
                        <div className="text-xs text-muted-foreground">Followers</div>
                      </div>
                      <div className="p-2 bg-muted rounded-md">
                        <div className="text-sm font-bold">89%</div>
                        <div className="text-xs text-muted-foreground">Activity</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant={account.active ? "ghost" : "outline"} 
                    size="sm"
                    onClick={() => toggleAccountStatus(index)}
                  >
                    {account.active ? 'Deactivate' : 'Activate'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="hover:bg-muted/50 transition-colors border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-full py-8">
                <div 
                  className="p-4 rounded-full bg-muted mb-4 cursor-pointer"
                  onClick={() => setIsAccountDialogOpen(true)}
                >
                  <Plus className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Add New Account</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Connect another social media platform
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-4"
                  onClick={() => setIsAccountDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="posts" className="mt-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>All Posts</CardTitle>
                    <NavigationMenu>
                      <NavigationMenuList>
                        <NavigationMenuItem>
                          <NavigationMenuTrigger>Filter Posts</NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="p-4 w-[200px]">
                              <div className="font-medium mb-2">Status</div>
                              <div className="space-y-1 mb-4">
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  All Posts
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  Published
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  Scheduled
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full justify-start">
                                  Drafts
                                </Button>
                              </div>
                              <div className="font-medium mb-2">Platform</div>
                              <div className="space-y-1">
                                {socialAccounts.map((account, index) => (
                                  <Button key={index} variant="ghost" size="sm" className="w-full justify-start">
                                    {getPlatformIcon(account.platform)}
                                    <span className="ml-2">{getPlatformName(account.platform)}</span>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  {posts.length > 0 ? (
                    <div className="space-y-4">
                      {posts.map((post) => (
                        <div key={post.id} className="border rounded-md p-4">
                          <div className="flex justify-between mb-2">
                            <div className="flex items-center">
                              {getPlatformIcon(post.platform)}
                              <span className="ml-2">{getPlatformName(post.platform)}</span>
                            </div>
                            <Badge variant={post.status === 'published' ? "success" : "secondary"}>
                              {post.status === 'published' ? 'Published' : 'Scheduled'}
                            </Badge>
                          </div>
                          
                          <p className="mb-4">{post.content}</p>
                          
                          {post.imageUrl && (
                            <div className="mb-4 bg-muted rounded-md p-2 text-center">
                              <Image className="h-5 w-5 mx-auto text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Image attached</span>
                            </div>
                          )}
                          
                          <div className="flex justify-between items-center text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {post.status === 'published' ? 
                                `Published: ${formatDate(post.publishedDate || new Date())}` : 
                                `Scheduled: ${formatDate(post.scheduledDate || new Date())}`}
                            </div>
                            
                            <div className="flex space-x-4">
                              <div className="flex items-center">
                                <span className="mr-1">👍</span>
                                {post.likes}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">💬</span>
                                {post.comments}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-1">↗️</span>
                                {post.shares}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {post.status !== 'published' && (
                              <Button variant="outline" size="sm">
                                <Share className="h-4 w-4 mr-1" />
                                Publish Now
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="text-lg font-medium">No Posts Yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Start creating content for your social media accounts
                      </p>
                      <Button onClick={() => setIsPostDialogOpen(true)} className="mt-4">
                        <Plus className="mr-2 h-4 w-4" /> Create First Post
                      </Button>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Showing {posts.length} posts
                    </div>
                    <Button variant="outline" disabled>
                      Load More
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <div className="md:w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Create Content</CardTitle>
                  <CardDescription>Post to your social accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Create New Post
                  </Button>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Post Ideas</h3>
                    <div className="space-y-2">
                      <div className="p-3 bg-muted rounded-md text-sm">
                        Share photos from your last church event
                      </div>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        Announce upcoming services and special events
                      </div>
                      <div className="p-3 bg-muted rounded-md text-sm">
                        Post a daily scripture or inspiration quote
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Schedule for Later</h3>
                    <p className="text-xs text-muted-foreground">
                      Plan your content calendar by scheduling posts in advance
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => setIsPostDialogOpen(true)}>
                      <Calendar className="mr-2 h-4 w-4" /> Schedule Post
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>Top performing content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="mb-1 text-sm font-medium">Top Platform</div>
                      <div className="flex items-center">
                        <Instagram className="h-5 w-5 text-pink-600 mr-2" />
                        <span>Instagram</span>
                        <span className="ml-auto text-green-600 text-sm">+12%</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1 text-sm font-medium">Best Time to Post</div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                        <span>Sundays, 8:00 AM</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="mb-1 text-sm font-medium">Most Engaging Content</div>
                      <div className="p-2 border rounded-md">
                        <p className="text-sm">"Join us this Sunday for a special service!"</p>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>45 likes</span>
                          <span>12 comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Analytics</CardTitle>
              <CardDescription>Track the performance of your social media presence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <p className="text-muted-foreground">Analytics dashboard will be implemented here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Track followers, engagement, reach and more across all your social platforms
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SocialMedia;

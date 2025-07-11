
import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import MemberList from '@/components/members/MemberList';
import { MemberDialog } from '@/components/members/MemberDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Plus, ChevronDown } from 'lucide-react';
import { Member } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Members = () => {
  const { members, addMember } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<string>('all');
  const [editingMember, setEditingMember] = useState<Member | undefined>();
  
  const [filteredMembers, setFilteredMembers] = useState<Member[]>(members);
  const activeMembers = members.filter(member => member.status === 'active');
  const newMembers = members.filter(member => member.newMemberDate && new Date(member.newMemberDate).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000);
  const visitorsProspects = members.filter(member => member.status === 'visitor' || member.status === 'prospect');
  const inactiveMembers = members.filter(member => member.status === 'inactive');

  useEffect(() => {
    let filtered = [...members];
    
    // Apply tab filter
    if (currentTab === 'active') {
      filtered = filtered.filter(member => member.status === 'active');
    } else if (currentTab === 'newMembers') {
      filtered = filtered.filter(member => 
        member.newMemberDate && 
        new Date(member.newMemberDate).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000
      );
    } else if (currentTab === 'visitorsProspects') {
      filtered = filtered.filter(member => member.status === 'visitor' || member.status === 'prospect');
    } else if (currentTab === 'inactive') {
      filtered = filtered.filter(member => member.status === 'inactive');
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        member =>
          member.firstName.toLowerCase().includes(query) ||
          member.lastName.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          (member.occupation && member.occupation.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.roles?.includes(roleFilter));
    }
    
    setFilteredMembers(filtered);
  }, [members, searchQuery, statusFilter, roleFilter, currentTab]);

  const handleAddMember = (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => {
    addMember(memberData);
    setDialogOpen(false);
    setEditingMember(undefined);
  };
  
  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{members.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeMembers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>New Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{newMembers.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Visitors & Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{visitorsProspects.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Members</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="newMembers">New Members</TabsTrigger>
            <TabsTrigger value="visitorsProspects">Visitors & Prospects</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-grow">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="volunteer">Volunteer</SelectItem>
                  <SelectItem value="member">Regular Member</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export as CSV</DropdownMenuItem>
                  <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                  <DropdownMenuItem>Print Member Directory</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <MemberList members={filteredMembers} onEdit={handleEditMember} />
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <MemberList members={filteredMembers} onEdit={handleEditMember} />
          </TabsContent>
          
          <TabsContent value="newMembers" className="mt-0">
            <MemberList members={filteredMembers} onEdit={handleEditMember} />
          </TabsContent>
          
          <TabsContent value="visitorsProspects" className="mt-0">
            <MemberList members={filteredMembers} onEdit={handleEditMember} />
          </TabsContent>
          
          <TabsContent value="inactive" className="mt-0">
            <MemberList members={filteredMembers} onEdit={handleEditMember} />
          </TabsContent>
        </Tabs>
      </div>

      <MemberDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        onSave={handleAddMember}
        member={editingMember}
      />
    </div>
  );
};

export default Members;

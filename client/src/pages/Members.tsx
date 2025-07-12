
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
  const newMembers = members.filter(member => {
    const joinDate = new Date(member.joinDate);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return joinDate > oneMonthAgo;
  });
  const visitorsProspects = members.filter(member => member.status === 'visitor' || member.status === 'prospect');
  const inactiveMembers = members.filter(member => member.status === 'inactive');

  useEffect(() => {
    let filtered = [...members];
    
    // Apply tab filter
    if (currentTab === 'active') {
      filtered = filtered.filter(member => member.status === 'active');
    } else if (currentTab === 'newMembers') {
      filtered = filtered.filter(member => {
        const joinDate = new Date(member.joinDate);
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return joinDate > oneMonthAgo;
      });
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

  const exportMembersToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Join Date', 'Category', 'City', 'Occupation'],
      ...filteredMembers.map(member => [
        `${member.firstName} ${member.lastName}`,
        member.email,
        member.phone || '',
        member.status,
        member.joinDate ? new Date(member.joinDate).toLocaleDateString() : '',
        member.category || '',
        member.city || '',
        member.occupation || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `members_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printMemberDirectory = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Member Directory</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .member-row { page-break-inside: avoid; }
              @media print { 
                body { margin: 0; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            <h1>Member Directory</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Category</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                ${filteredMembers.map(member => `
                  <tr class="member-row">
                    <td>${member.firstName} ${member.lastName}</td>
                    <td>${member.email}</td>
                    <td>${member.phone || ''}</td>
                    <td>${member.status}</td>
                    <td>${member.joinDate ? new Date(member.joinDate).toLocaleDateString() : ''}</td>
                    <td>${member.category || ''}</td>
                    <td>${member.city || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Members</h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportMembersToCSV}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={printMemberDirectory}>
                Print Directory
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
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
        member={editingMember}
        onSave={handleAddMember}
      />
    </div>
  );
};

export default Members;

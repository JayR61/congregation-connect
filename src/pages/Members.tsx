
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, Grid3X3, List, UserPlus, Upload, Users, Award, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Check } from "@/components/ui/check";
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@/context/AppContext';
import { Member, ChurchStructure, MemberCategory } from '@/types';
import MemberCard from '@/components/members/MemberCard';
import MemberList from '@/components/members/MemberList';
import MemberDialog from '@/components/members/MemberDialog';
import { getMembers } from '@/data/mockData';

const Members = () => {
  const navigate = useNavigate();
  const { members } = useAppContext();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | undefined>(undefined);
  
  const { isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: getMembers
  });

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          member.status === statusFilter || 
                          (statusFilter === 'active' && member.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleAddMember = () => {
    setSelectedMember(undefined);
    setDialogOpen(true);
  };
  
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setSelectedMember(undefined);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage church members and their information</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddMember}>
            <UserPlus className="mr-2 h-4 w-4" /> Add Member
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="prospect">Prospect</SelectItem>
              <SelectItem value="visitor">Visitor</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Members</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="new">New Members</TabsTrigger>
          <TabsTrigger value="leadership">Leadership</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="p-6 border rounded-md">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-32 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onClick={() => navigate(`/members/${member.id}`)}
                />
              ))}
            </div>
          ) : (
            <MemberList 
              members={filteredMembers} 
              onEdit={handleEditMember}
            />
          )}

          {filteredMembers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No members found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={handleAddMember} className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" /> Add Member
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="active">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Active Members</h3>
            <p className="text-muted-foreground mt-2">
              This tab shows members with "active" status
            </p>
            {members.filter(m => m.status === 'active' || m.isActive).length === 0 ? (
              <Button onClick={handleAddMember} className="mt-4">
                <UserPlus className="mr-2 h-4 w-4" /> Add Active Member
              </Button>
            ) : (
              <p className="mt-4">Use the status filter above to see only active members</p>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="new">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">New Members</h3>
            <p className="text-muted-foreground mt-2">
              This tab would show recently added members
            </p>
            <Button onClick={handleAddMember} className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Member
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="leadership">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Leadership</h3>
            <p className="text-muted-foreground mt-2">
              This tab would show members in leadership positions
            </p>
            <Button onClick={handleAddMember} className="mt-4">
              <UserPlus className="mr-2 h-4 w-4" /> Add Leader
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <MemberDialog 
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        member={selectedMember}
      />
    </div>
  );
};

export default Members;

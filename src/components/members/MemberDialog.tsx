
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X, Search, UserPlus, Upload, Save } from 'lucide-react';
import { toast } from '@/lib/toast';

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
}

const MemberDialog: React.FC<MemberDialogProps> = ({ open, onOpenChange, member }) => {
  const { members, addMember, updateMember } = useAppContext();
  const [mode, setMode] = useState<'individual' | 'bulk'>('individual');
  const [bulkText, setBulkText] = useState('');
  const [bulkMembers, setBulkMembers] = useState<Array<Partial<Member>>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Individual member form state
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    familyIds: [],
    status: 'active',
    notes: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  // Reset or set form data when dialog opens/closes or member changes
  useEffect(() => {
    if (open) {
      if (member) {
        setFormData({
          ...member,
          joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        });
        setMode('individual');
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          familyIds: [],
          status: 'active',
          notes: '',
          joinDate: new Date().toISOString().split('T')[0],
        });
      }
      setBulkText('');
      setBulkMembers([]);
    }
  }, [open, member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleFamilyMemberSelect = (memberId: string) => {
    setFormData((prev) => {
      const familyIds = prev.familyIds || [];
      if (familyIds.includes(memberId)) {
        return { ...prev, familyIds: familyIds.filter(id => id !== memberId) };
      } else {
        return { ...prev, familyIds: [...familyIds, memberId] };
      }
    });
  };

  const processBulkImport = () => {
    try {
      // Simple CSV parsing (Name, Email, Phone)
      const rows = bulkText.split('\n').filter(row => row.trim());
      const newMembers = rows.map(row => {
        const [fullName, email, phone] = row.split(',').map(item => item.trim());
        const [firstName, ...lastNameArr] = fullName.split(' ');
        const lastName = lastNameArr.join(' ');
        
        return {
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          phone: phone || '',
          status: 'active',
          joinDate: new Date().toISOString(),
        };
      });
      
      setBulkMembers(newMembers);
      toast.success(`Processed ${newMembers.length} members`);
    } catch (error) {
      console.error("Error processing bulk import:", error);
      toast.error("Failed to process bulk import. Please check your format.");
    }
  };

  const handleSave = () => {
    if (mode === 'individual') {
      if (!formData.firstName || !formData.lastName) {
        toast.error("First name and last name are required");
        return;
      }

      if (member) {
        updateMember(member.id, formData);
      } else {
        addMember(formData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      }
    } else {
      // Bulk import
      if (bulkMembers.length === 0) {
        toast.error("No members to import");
        return;
      }

      // Add all members in the bulkMembers array
      bulkMembers.forEach(memberData => {
        addMember(memberData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      });
      
      toast.success(`Added ${bulkMembers.length} members successfully`);
    }
    
    onOpenChange(false);
  };

  const filteredMembers = members.filter(m => 
    m.id !== member?.id && // Don't show current member
    (`${m.firstName} ${m.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{member ? 'Edit Member' : 'Add Member'}</DialogTitle>
          <DialogDescription>
            {member 
              ? 'Update member information in the directory.' 
              : 'Add a new member to the church directory.'}
          </DialogDescription>
        </DialogHeader>
        
        {!member && (
          <Tabs defaultValue="individual" className="mb-4" onValueChange={(value) => setMode(value as 'individual' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual">
              <p className="text-sm text-muted-foreground mb-4">
                Add a single member with detailed information
              </p>
            </TabsContent>
            
            <TabsContent value="bulk">
              <p className="text-sm text-muted-foreground mb-4">
                Import multiple members at once using CSV format: Name, Email, Phone
              </p>
              <div className="space-y-4">
                <Textarea 
                  placeholder="John Doe, john@example.com, 555-123-4567&#10;Jane Smith, jane@example.com, 555-987-6543" 
                  className="min-h-[150px] font-mono text-sm"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setBulkText('')}>
                    Clear
                  </Button>
                  <Button onClick={processBulkImport}>
                    <Upload className="mr-2 h-4 w-4" /> Process
                  </Button>
                </div>
                
                {bulkMembers.length > 0 && (
                  <div className="border rounded-md p-4 mt-4">
                    <h3 className="font-medium mb-2">Processed Members ({bulkMembers.length})</h3>
                    <ScrollArea className="h-[120px]">
                      <ul className="space-y-2">
                        {bulkMembers.map((bm, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span>{bm.firstName} {bm.lastName}</span>
                            <span className="text-muted-foreground">{bm.email}</span>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {(mode === 'individual' || member) && (
          <ScrollArea className="flex-grow">
            <div className="space-y-4 px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input 
                  id="joinDate"
                  name="joinDate"
                  type="date"
                  value={formData.joinDate}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="visitor">Visitor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Family Members</Label>
                <div className="border rounded-md p-2">
                  <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search members..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <ScrollArea className="h-[120px]">
                    <div className="space-y-1">
                      {filteredMembers.length > 0 ? (
                        filteredMembers.map((m) => (
                          <div
                            key={m.id}
                            className={`px-2 py-1 rounded-md text-sm cursor-pointer flex items-center justify-between ${
                              formData.familyIds?.includes(m.id) ? 'bg-primary/10' : 'hover:bg-muted'
                            }`}
                            onClick={() => handleFamilyMemberSelect(m.id)}
                          >
                            <span>{m.firstName} {m.lastName}</span>
                            {formData.familyIds?.includes(m.id) && (
                              <X className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-2 text-sm text-muted-foreground">
                          No members found
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  placeholder="Additional notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
          </ScrollArea>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            {member ? 'Update Member' : 'Save Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;

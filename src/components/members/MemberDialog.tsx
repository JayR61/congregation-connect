
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member, MemberCategory, ChurchStructure, Position, MemberStatus } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X, Search, UserPlus, Upload, Save, Plus, Trash, CheckCircle } from 'lucide-react';
import { toast } from '@/lib/toast';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [activeTab, setActiveTab] = useState('basic');
  
  // Individual member form state
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    familyIds: [],
    status: 'active' as MemberStatus,
    notes: '',
    joinDate: new Date(),
    category: 'regular' as MemberCategory,
    structures: [] as ChurchStructure[],
    positions: [] as Position[],
    occupation: '',
    isFullMember: false,
    newMemberDate: new Date(),
  });

  // Positions form state
  const [newPosition, setNewPosition] = useState<Partial<Position>>({
    structure: 'senior_leadership' as ChurchStructure,
    title: '',
    startDate: new Date(),
  });

  // Reset or set form data when dialog opens/closes or member changes
  useEffect(() => {
    if (open) {
      if (member) {
        setFormData({
          ...member,
          joinDate: member.joinDate || new Date(),
          // Ensure familyIds exists
          familyIds: member.familyIds || (member.familyId ? [member.familyId] : [])
        });
        setMode('individual');
        setActiveTab('basic');
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          familyIds: [],
          status: 'active' as MemberStatus,
          notes: '',
          joinDate: new Date(),
          category: 'regular' as MemberCategory,
          structures: [] as ChurchStructure[],
          positions: [] as Position[],
          occupation: '',
          isFullMember: false,
          newMemberDate: new Date(),
        });
      }
      setNewPosition({
        structure: 'senior_leadership' as ChurchStructure,
        title: '',
        startDate: new Date(),
      });
      setBulkText('');
      setBulkMembers([]);
    }
  }, [open, member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({ ...prev, status: value as MemberStatus }));
  };

  const handleCategoryChange = (value: MemberCategory) => {
    setFormData((prev) => {
      // If new member is selected, set the newMemberDate to today
      if (value === 'new' && prev.newMemberDate === undefined) {
        return { ...prev, category: value, newMemberDate: new Date() };
      }
      return { ...prev, category: value };
    });
  };

  const handleStructureToggle = (structure: ChurchStructure) => {
    setFormData((prev) => {
      const structures = prev.structures || [];
      if (structures.includes(structure)) {
        return { ...prev, structures: structures.filter(s => s !== structure) };
      } else {
        return { ...prev, structures: [...structures, structure] };
      }
    });
  };

  const handlePositionChange = (field: keyof Position, value: any) => {
    setNewPosition(prev => ({ ...prev, [field]: value }));
  };

  const addPosition = () => {
    if (!newPosition.title || !newPosition.structure || !newPosition.startDate) {
      toast.error("Please fill in all position fields");
      return;
    }
    
    setFormData(prev => {
      const positions = prev.positions || [];
      return {
        ...prev,
        positions: [...positions, newPosition as Position]
      };
    });
    
    setNewPosition({
      structure: 'senior_leadership' as ChurchStructure,
      title: '',
      startDate: new Date(),
    });
  };

  const removePosition = (index: number) => {
    setFormData(prev => {
      const positions = prev.positions ? [...prev.positions] : [];
      positions.splice(index, 1);
      return { ...prev, positions };
    });
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

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }));
  };

  const processBulkImport = () => {
    try {
      // Process entered member data
      const rows = bulkText.split('\n').filter(row => row.trim());
      const newMembers = rows.map(row => {
        const columns = row.split(',').map(item => item.trim());
        
        // Check if we have at least 4 columns (name, email, phone, category)
        if (columns.length < 4) {
          throw new Error(`Invalid format in row: ${row}`);
        }
        
        const [fullName, email, phone, category, address = '', occupation = ''] = columns;
        const nameParts = fullName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        const joinDate = new Date();
        const isNewMember = category?.toLowerCase() === 'new';
        
        return {
          firstName,
          lastName,
          email: email || '',
          phone: phone || '',
          address: address || '',
          status: 'active' as MemberStatus,
          category: (category || 'regular') as MemberCategory,
          joinDate,
          isActive: true,
          occupation: occupation || '',
          isFullMember: false,
          newMemberDate: isNewMember ? joinDate : null,
          structures: [] as ChurchStructure[],
          positions: [] as Position[],
        } as Partial<Member>;
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

      // Prepare data for saving with correct types
      const memberData = {
        ...formData,
        isActive: formData.status === 'active', // Map status to isActive
        // Convert joinDate string to Date if needed
        joinDate: formData.joinDate instanceof Date ? formData.joinDate : new Date(formData.joinDate as string),
        // If category is "new", ensure newMemberDate is set
        newMemberDate: formData.category === 'new' ? (formData.newMemberDate || new Date()) : formData.newMemberDate,
        // Ensure attachments and other required fields exist
        attachments: formData.attachments || [],
      };

      if (member) {
        updateMember(member.id, memberData);
      } else {
        addMember(memberData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      }
    } else {
      // Bulk import
      if (bulkMembers.length === 0) {
        toast.error("No members to import");
        return;
      }

      // Add all members in the bulkMembers array with correct types
      bulkMembers.forEach(memberData => {
        const preparedData = {
          ...memberData,
          isActive: memberData.status === 'active',
          joinDate: memberData.joinDate instanceof Date ? memberData.joinDate : new Date(memberData.joinDate as string),
          attachments: memberData.attachments || [],
        };
        addMember(preparedData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      });
      
      toast.success(`Added ${bulkMembers.length} members successfully`);
    }
    
    onOpenChange(false);
  };

  const filteredMembers = members.filter(m => 
    m.id !== member?.id && // Don't show current member
    (`${m.firstName} ${m.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function to format date for input
  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="pb-2">
          <DialogTitle>{member ? 'Edit Member' : 'Add Member'}</DialogTitle>
          <DialogDescription>
            {member 
              ? 'Update member information in the directory.' 
              : 'Add a new member to the church directory.'}
          </DialogDescription>
        </DialogHeader>
        
        {!member && (
          <Tabs defaultValue="individual" className="mb-2" onValueChange={(value) => setMode(value as 'individual' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual">
              <p className="text-sm text-muted-foreground mb-2">
                Add a single member with detailed information
              </p>
            </TabsContent>
            
            <TabsContent value="bulk">
              <p className="text-sm text-muted-foreground mb-2">
                Import multiple members at once. Enter one member per line in the format:<br/>
                <span className="font-mono text-xs">Name, Email, Phone, Category, Address (optional), Occupation (optional)</span>
              </p>
              <div className="space-y-4">
                <Textarea 
                  placeholder="John Doe, john@example.com, 555-123-4567, elder, 123 Main St, Pastor&#10;Jane Smith, jane@example.com, 555-987-6543, new, 456 Church Ave, Youth Leader" 
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
                  <div className="border rounded-md p-4 mt-2">
                    <h3 className="font-medium mb-2">Processed Members ({bulkMembers.length})</h3>
                    <ScrollArea className="h-[120px]">
                      <ul className="space-y-2">
                        {bulkMembers.map((bm, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span>{bm.firstName} {bm.lastName}</span>
                            <span className="text-muted-foreground">{bm.email} ({bm.category || 'regular'})</span>
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
          <div className="flex-grow flex flex-col overflow-hidden">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="flex-grow flex flex-col">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="roles">Roles & Positions</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <div className="flex-grow overflow-auto mt-4">
                <div className="p-1 space-y-6">
                  <TabsContent value="basic" className="space-y-4 m-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input 
                          id="firstName"
                          name="firstName"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input 
                          id="lastName"
                          name="lastName"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        name="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
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
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state"
                          name="state"
                          placeholder="State"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">Zip Code</Label>
                        <Input 
                          id="zip"
                          name="zip"
                          placeholder="Zip Code"
                          value={formData.zip}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="occupation">Occupation/Role</Label>
                      <Input 
                        id="occupation"
                        name="occupation"
                        placeholder="Occupation or role in church"
                        value={formData.occupation}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="joinDate">Join Date *</Label>
                        <Input 
                          id="joinDate"
                          name="joinDate"
                          type="date"
                          value={formatDateForInput(formData.joinDate)}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status">Status *</Label>
                        <Select 
                          value={formData.status as string} 
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
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Member Category *</Label>
                        <Select 
                          value={formData.category as string} 
                          onValueChange={(value) => handleCategoryChange(value as MemberCategory)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elder">Elder</SelectItem>
                            <SelectItem value="pastor">Pastor</SelectItem>
                            <SelectItem value="youth">Youth</SelectItem>
                            <SelectItem value="child">Child (Sunday School)</SelectItem>
                            <SelectItem value="visitor">Visitor</SelectItem>
                            <SelectItem value="new">New Member</SelectItem>
                            <SelectItem value="regular">Regular Member</SelectItem>
                            <SelectItem value="full">Full Member</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.category === 'new' && (
                        <div className="space-y-2">
                          <Label htmlFor="newMemberDate">New Member Since</Label>
                          <Input 
                            id="newMemberDate"
                            name="newMemberDate"
                            type="date"
                            value={formatDateForInput(formData.newMemberDate)}
                            onChange={handleChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox 
                        id="isFullMember" 
                        checked={formData.isFullMember || false}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange('isFullMember', checked === true)
                        }
                      />
                      <Label 
                        htmlFor="isFullMember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Full Church Member
                      </Label>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="roles" className="space-y-6 m-0">
                    <div className="space-y-3">
                      <Label>Church Structures</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: 'senior_leadership', label: 'Senior Leadership' },
                          { id: 'youth_leadership', label: 'Youth Leadership' },
                          { id: 'mens_forum', label: "Men's Forum" },
                          { id: 'sunday_school', label: 'Sunday School' },
                        ].map((structure) => (
                          <div key={structure.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={structure.id}
                              checked={(formData.structures || []).includes(structure.id as ChurchStructure)}
                              onCheckedChange={() => handleStructureToggle(structure.id as ChurchStructure)}
                            />
                            <label
                              htmlFor={structure.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {structure.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Leadership Positions</Label>
                      <div className="space-y-4">
                        {(formData.positions || []).map((position, index) => (
                          <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                            <div className="flex-1">
                              <p className="font-medium">{position.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {position.structure.replace('_', ' ')} | 
                                Since: {new Date(position.startDate).toLocaleDateString()}
                              </p>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removePosition(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        
                        <div className="space-y-3 p-3 border rounded-md">
                          <div className="space-y-2">
                            <Label htmlFor="positionTitle">Position Title</Label>
                            <Input 
                              id="positionTitle"
                              placeholder="Position title"
                              value={newPosition.title}
                              onChange={(e) => handlePositionChange('title', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="positionStructure">Structure</Label>
                            <Select 
                              value={newPosition.structure as string}
                              onValueChange={(value) => handlePositionChange('structure', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select structure" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="senior_leadership">Senior Leadership</SelectItem>
                                <SelectItem value="youth_leadership">Youth Leadership</SelectItem>
                                <SelectItem value="mens_forum">Men's Forum</SelectItem>
                                <SelectItem value="sunday_school">Sunday School</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="positionStartDate">Start Date</Label>
                            <Input 
                              id="positionStartDate"
                              type="date"
                              value={formatDateForInput(newPosition.startDate)}
                              onChange={(e) => handlePositionChange('startDate', new Date(e.target.value))}
                            />
                          </div>
                          
                          <Button onClick={addPosition} className="w-full mt-2">
                            <Plus className="mr-2 h-4 w-4" /> Add Position
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="family" className="space-y-4 m-0">
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
                        
                        <div className="h-[200px] overflow-auto">
                          <div className="space-y-1">
                            {filteredMembers.length > 0 ? (
                              filteredMembers.map((m) => (
                                <div
                                  key={m.id}
                                  className={`px-2 py-1 rounded-md text-sm cursor-pointer flex items-center justify-between ${
                                    (formData.familyIds || []).includes(m.id) ? 'bg-primary/10' : 'hover:bg-muted'
                                  }`}
                                  onClick={() => handleFamilyMemberSelect(m.id)}
                                >
                                  <span>{m.firstName} {m.lastName}</span>
                                  {(formData.familyIds || []).includes(m.id) && (
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
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="notes" className="space-y-4 m-0">
                    <div className="space-y-2">
                      <Label htmlFor="notes">General Notes</Label>
                      <Textarea 
                        id="notes"
                        name="notes"
                        placeholder="Additional notes about this member"
                        value={formData.notes || ''}
                        onChange={handleChange}
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                </div>
              </div>
            </Tabs>
          </div>
        )}
        
        <DialogFooter className="mt-4 pt-2 border-t">
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

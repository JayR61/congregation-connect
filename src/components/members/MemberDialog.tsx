import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Member, MemberCategory, ChurchStructure, Position, MemberStatus, MentorshipProgram, Volunteer, SocialMediaAccount, ResourceBooking } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { X, Search, UserPlus, Upload, Save, Plus, Trash, CheckCircle, Monitor, Briefcase, Bookmark, Link } from 'lucide-react';
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
    attachments: [],
    mentorshipPrograms: [],
    volunteerRoles: [],
    socialMediaAccounts: [],
    resourceBookings: [],
  });

  const [newPosition, setNewPosition] = useState<Partial<Position>>({
    structure: 'senior_leadership' as ChurchStructure,
    title: '',
    startDate: new Date(),
  });

  const [newMentorship, setNewMentorship] = useState<Partial<MentorshipProgram>>({
    name: '',
    description: '',
    startDate: new Date(),
    goals: [],
    progress: 0,
  });

  const [mentorshipGoal, setMentorshipGoal] = useState('');

  const [newVolunteer, setNewVolunteer] = useState<Partial<Volunteer>>({
    area: '',
    role: '',
    startDate: new Date(),
    availability: [],
  });

  const [newSocialMedia, setNewSocialMedia] = useState<Partial<SocialMediaAccount>>({
    platform: 'facebook' as const,
    url: '',
    username: '',
    active: true,
  });

  const [newResourceBooking, setNewResourceBooking] = useState<Partial<ResourceBooking>>({
    resourceId: '',
    purpose: '',
    startDateTime: new Date(),
    endDateTime: new Date(),
    status: 'pending' as const,
  });

  useEffect(() => {
    if (open) {
      if (member) {
        setFormData({
          ...member,
          joinDate: member.joinDate || new Date(),
          familyIds: member.familyIds || (member.familyId ? [member.familyId] : []),
          attachments: member.attachments || [],
          mentorshipPrograms: member.mentorshipPrograms || [],
          volunteerRoles: member.volunteerRoles || [],
          socialMediaAccounts: member.socialMediaAccounts || [],
          resourceBookings: member.resourceBookings || [],
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
          attachments: [],
          mentorshipPrograms: [],
          volunteerRoles: [],
          socialMediaAccounts: [],
          resourceBookings: [],
        });
      }
      setNewPosition({
        structure: 'senior_leadership' as ChurchStructure,
        title: '',
        startDate: new Date(),
      });
      setNewMentorship({
        name: '',
        description: '',
        startDate: new Date(),
        goals: [],
        progress: 0,
      });
      setMentorshipGoal('');
      setNewVolunteer({
        area: '',
        role: '',
        startDate: new Date(),
        availability: [],
      });
      setNewSocialMedia({
        platform: 'facebook' as const,
        url: '',
        username: '',
        active: true,
      });
      setNewResourceBooking({
        resourceId: '',
        purpose: '',
        startDateTime: new Date(),
        endDateTime: new Date(),
        status: 'pending' as const,
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
      const rows = bulkText.split('\n').filter(row => row.trim());
      const newMembers = rows.map(row => {
        const columns = row.split(',').map(item => item.trim());
        
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
          attachments: [],
        } as Partial<Member>;
      });
      
      setBulkMembers(newMembers);
      toast.success(`Processed ${newMembers.length} members`);
    } catch (error) {
      console.error("Error processing bulk import:", error);
      toast.error("Failed to process bulk import. Please check your format.");
    }
  };

  const handleMentorshipChange = (field: keyof MentorshipProgram, value: any) => {
    setNewMentorship(prev => ({ ...prev, [field]: value }));
  };

  const addMentorshipGoal = () => {
    if (mentorshipGoal.trim() === '') return;
    setNewMentorship(prev => ({
      ...prev,
      goals: [...(prev.goals || []), mentorshipGoal]
    }));
    setMentorshipGoal('');
  };

  const removeMentorshipGoal = (index: number) => {
    setNewMentorship(prev => {
      const goals = [...(prev.goals || [])];
      goals.splice(index, 1);
      return { ...prev, goals };
    });
  };

  const addMentorshipProgram = () => {
    if (!newMentorship.name || !newMentorship.startDate) {
      toast.error("Please fill in required mentorship program fields");
      return;
    }
    
    setFormData(prev => {
      const mentorshipPrograms = prev.mentorshipPrograms || [];
      return {
        ...prev,
        mentorshipPrograms: [...mentorshipPrograms, {
          ...newMentorship,
          id: `mentorship-${Date.now()}`,
          goals: newMentorship.goals || [],
          progress: newMentorship.progress || 0,
        } as MentorshipProgram]
      };
    });
    
    setNewMentorship({
      name: '',
      description: '',
      startDate: new Date(),
      goals: [],
      progress: 0,
    });
  };

  const removeMentorshipProgram = (index: number) => {
    setFormData(prev => {
      const mentorshipPrograms = prev.mentorshipPrograms ? [...prev.mentorshipPrograms] : [];
      mentorshipPrograms.splice(index, 1);
      return { ...prev, mentorshipPrograms };
    });
  };

  const handleVolunteerChange = (field: keyof Volunteer, value: any) => {
    setNewVolunteer(prev => ({ ...prev, [field]: value }));
  };

  const toggleVolunteerAvailability = (day: string) => {
    setNewVolunteer(prev => {
      const availability = prev.availability || [];
      if (availability.includes(day)) {
        return { ...prev, availability: availability.filter(d => d !== day) };
      } else {
        return { ...prev, availability: [...availability, day] };
      }
    });
  };

  const addVolunteerRole = () => {
    if (!newVolunteer.area || !newVolunteer.role) {
      toast.error("Please fill in required volunteer fields");
      return;
    }
    
    setFormData(prev => {
      const volunteerRoles = prev.volunteerRoles || [];
      return {
        ...prev,
        volunteerRoles: [...volunteerRoles, {
          ...newVolunteer,
          id: `volunteer-${Date.now()}`,
          memberId: member?.id || '',
          availability: newVolunteer.availability || [],
        } as Volunteer]
      };
    });
    
    setNewVolunteer({
      area: '',
      role: '',
      startDate: new Date(),
      availability: [],
    });
  };

  const removeVolunteerRole = (index: number) => {
    setFormData(prev => {
      const volunteerRoles = prev.volunteerRoles ? [...prev.volunteerRoles] : [];
      volunteerRoles.splice(index, 1);
      return { ...prev, volunteerRoles };
    });
  };

  const handleSocialMediaChange = (field: keyof SocialMediaAccount, value: any) => {
    setNewSocialMedia(prev => ({ ...prev, [field]: value }));
  };

  const addSocialMedia = () => {
    if (!newSocialMedia.url) {
      toast.error("Please enter a URL for the social media account");
      return;
    }
    
    setFormData(prev => {
      const socialMediaAccounts = prev.socialMediaAccounts || [];
      return {
        ...prev,
        socialMediaAccounts: [...socialMediaAccounts, {
          ...newSocialMedia,
          active: newSocialMedia.active || true,
        } as SocialMediaAccount]
      };
    });
    
    setNewSocialMedia({
      platform: 'facebook' as const,
      url: '',
      username: '',
      active: true,
    });
  };

  const removeSocialMedia = (index: number) => {
    setFormData(prev => {
      const socialMediaAccounts = prev.socialMediaAccounts ? [...prev.socialMediaAccounts] : [];
      socialMediaAccounts.splice(index, 1);
      return { ...prev, socialMediaAccounts };
    });
  };

  const handleResourceBookingChange = (field: keyof ResourceBooking, value: any) => {
    setNewResourceBooking(prev => ({ ...prev, [field]: value }));
  };

  const addResourceBooking = () => {
    if (!newResourceBooking.purpose || !newResourceBooking.resourceId) {
      toast.error("Please fill in required resource booking fields");
      return;
    }
    
    setFormData(prev => {
      const resourceBookings = prev.resourceBookings || [];
      return {
        ...prev,
        resourceBookings: [...resourceBookings, {
          ...newResourceBooking,
          id: `booking-${Date.now()}`,
          memberId: member?.id || '',
          status: newResourceBooking.status || 'pending',
        } as ResourceBooking]
      };
    });
    
    setNewResourceBooking({
      resourceId: '',
      purpose: '',
      startDateTime: new Date(),
      endDateTime: new Date(),
      status: 'pending' as const,
    });
  };

  const removeResourceBooking = (index: number) => {
    setFormData(prev => {
      const resourceBookings = prev.resourceBookings ? [...prev.resourceBookings] : [];
      resourceBookings.splice(index, 1);
      return { ...prev, resourceBookings };
    });
  };

  const handleSave = () => {
    if (mode === 'individual') {
      if (!formData.firstName || !formData.lastName) {
        toast.error("First name and last name are required");
        return;
      }

      const memberData = {
        ...formData,
        isActive: formData.status === 'active',
        joinDate: formData.joinDate instanceof Date ? formData.joinDate : new Date(formData.joinDate as string),
        newMemberDate: formData.category === 'new' ? (formData.newMemberDate || new Date()) : formData.newMemberDate,
        attachments: formData.attachments || [],
        mentorshipPrograms: formData.mentorshipPrograms || [],
        volunteerRoles: formData.volunteerRoles || [],
        socialMediaAccounts: formData.socialMediaAccounts || [],
        resourceBookings: formData.resourceBookings || [],
      };

      if (member) {
        updateMember(member.id, memberData);
      } else {
        addMember(memberData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      }
    } else {
      if (bulkMembers.length === 0) {
        toast.error("No members to import");
        return;
      }

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
    m.id !== member?.id && 
    (`${m.firstName} ${m.lastName}`).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateForInput = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>{member ? 'Edit Member' : 'Add Member'}</DialogTitle>
          <DialogDescription>
            {member 
              ? 'Update member information in the directory.' 
              : 'Add a new member to the church directory.'}
          </DialogDescription>
        </DialogHeader>
        
        {!member && (
          <Tabs defaultValue="individual" className="shrink-0" onValueChange={(value) => setMode(value as 'individual' | 'bulk')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="m-0">
              <p className="text-sm text-muted-foreground mb-2">
                Add a single member with detailed information
              </p>
            </TabsContent>
            
            <TabsContent value="bulk" className="m-0">
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
                    <div className="max-h-[120px] overflow-y-auto">
                      <ul className="space-y-2">
                        {bulkMembers.map((bm, idx) => (
                          <li key={idx} className="text-sm flex justify-between">
                            <span>{bm.firstName} {bm.lastName}</span>
                            <span className="text-muted-foreground">{bm.email} ({bm.category || 'regular'})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
        
        {(mode === 'individual' || member) && (
          <div className="flex-grow overflow-hidden flex flex-col">
            <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
              <TabsList className="grid grid-cols-8 shrink-0">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
                <TabsTrigger value="family">Family</TabsTrigger>
                <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
                <TabsTrigger value="volunteer">Volunteer</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <div className="mt-4 flex-grow overflow-hidden">
                <ScrollArea className="h-[calc(85vh-280px)]">
                  <div className="pr-4 pb-6">
                    <TabsContent value="basic" className="m-0 space-y-4">
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
                    
                    <TabsContent value="roles" className="m-0 space-y-6">
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
                    
                    <TabsContent value="family" className="m-0 space-y-4">
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
                          
                          <div className="max-h-[200px] overflow-y-auto">
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
                    
                    <TabsContent value="mentorship" className="m-0 space-y-6">
                      <div className="space-y-3">
                        <Label>Mentorship Programs</Label>
                        <div className="space-y-4">
                          {(formData.mentorshipPrograms || []).map((program, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                              <div className="flex-1">
                                <p className="font-medium">{program.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Started: {new Date(program.startDate).toLocaleDateString()} | 
                                  Progress: {program.progress}%
                                </p>
                                {program.goals && program.goals.length > 0 && (
                                  <div className="mt-2">
                                    <p className="text-sm font-medium">Goals:</p>
                                    <ul className="text-sm list-disc pl-5">
                                      {program.goals.map((goal, idx) => (
                                        <li key={idx}>{goal}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeMentorshipProgram(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="space-y-3 p-3 border rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="mentorshipName">Program Name</Label>
                              <Input 
                                id="mentorshipName"
                                placeholder="Program name"
                                value={newMentorship.name}
                                onChange={(e) => handleMentorshipChange('name', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mentorshipDescription">Description</Label>
                              <Textarea 
                                id="mentorshipDescription"
                                placeholder="Program description"
                                value={newMentorship.description}
                                onChange={(e) => handleMentorshipChange('description', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mentorshipStartDate">Start Date</Label>
                              <Input 
                                id="mentorshipStartDate"
                                type="date"
                                value={formatDateForInput(newMentorship.startDate)}
                                onChange={(e) => handleMentorshipChange('startDate', new Date(e.target.value))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="mentorshipProgress">Progress (%)</Label>
                              <Input 
                                id="mentorshipProgress"
                                type="number"
                                min="0"
                                max="100"
                                value={newMentorship.progress}
                                onChange={(e) => handleMentorshipChange('progress', parseInt(e.target.value) || 0)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Goals</Label>
                              <div className="flex space-x-2">
                                <Input
                                  placeholder="Add a goal"
                                  value={mentorshipGoal}
                                  onChange={(e) => setMentorshipGoal(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      addMentorshipGoal();
                                    }
                                  }}
                                />
                                <Button type="button" onClick={addMentorshipGoal}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              {(newMentorship.goals || []).length > 0 && (
                                <div className="mt-2">
                                  <ul className="space-y-1">
                                    {(newMentorship.goals || []).map((goal, idx) => (
                                      <li key={idx} className="flex items-center justify-between text-sm bg-muted px-2 py-1 rounded">
                                        <span>{goal}</span>
                                        <Button variant="ghost" size="sm" onClick={() => removeMentorshipGoal(idx)}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                            
                            <Button onClick={addMentorshipProgram} className="w-full mt-2">
                              <Plus className="mr-2 h-4 w-4" /> Add Mentorship Program
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="volunteer" className="m-0 space-y-6">
                      <div className="space-y-3">
                        <Label>Volunteer Roles</Label>
                        <div className="space-y-4">
                          {(formData.volunteerRoles || []).map((role, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                              <div className="flex-1">
                                <p className="font-medium">{role.role}</p>
                                <p className="text-sm text-muted-foreground">
                                  Area: {role.area} | 
                                  Since: {new Date(role.startDate).toLocaleDateString()}
                                </p>
                                {role.availability && role.availability.length > 0 && (
                                  <p className="text-sm mt-1">
                                    Available: {role.availability.join(', ')}
                                  </p>
                                )}
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeVolunteerRole(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="space-y-3 p-3 border rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="volunteerArea">Ministry/Area</Label>
                              <Input 
                                id="volunteerArea"
                                placeholder="Ministry or area"
                                value={newVolunteer.area}
                                onChange={(e) => handleVolunteerChange('area', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="volunteerRole">Role</Label>
                              <Input 
                                id="volunteerRole"
                                placeholder="Volunteer role"
                                value={newVolunteer.role}
                                onChange={(e) => handleVolunteerChange('role', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="volunteerStartDate">Start Date</Label>
                              <Input 
                                id="volunteerStartDate"
                                type="date"
                                value={formatDateForInput(newVolunteer.startDate)}
                                onChange={(e) => handleVolunteerChange('startDate', new Date(e.target.value))}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Availability</Label>
                              <div className="grid grid-cols-4 gap-2">
                                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                                  <div key={day} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`day-${day}`}
                                      checked={(newVolunteer.availability || []).includes(day)}
                                      onCheckedChange={() => toggleVolunteerAvailability(day)}
                                    />
                                    <label
                                      htmlFor={`day-${day}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      {day}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <Button onClick={addVolunteerRole} className="w-full mt-2">
                              <Plus className="mr-2 h-4 w-4" /> Add Volunteer Role
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="social" className="m-0 space-y-6">
                      <div className="space-y-3">
                        <Label>Social Media Accounts</Label>
                        <div className="space-y-4">
                          {(formData.socialMediaAccounts || []).map((account, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                              <div className="flex-1">
                                <p className="font-medium">{account.platform}</p>
                                <p className="text-sm text-muted-foreground truncate">
                                  {account.url}
                                </p>
                                <p className="text-xs">
                                  Status: {account.active ? 'Active' : 'Inactive'}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeSocialMedia(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="space-y-3 p-3 border rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="socialPlatform">Platform</Label>
                              <Select 
                                value={newSocialMedia.platform as string}
                                onValueChange={(value) => handleSocialMediaChange('platform', value)}
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
                            
                            <div className="space-y-2">
                              <Label htmlFor="socialUrl">URL</Label>
                              <Input 
                                id="socialUrl"
                                placeholder="https://..."
                                value={newSocialMedia.url}
                                onChange={(e) => handleSocialMediaChange('url', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="socialUsername">Username (optional)</Label>
                              <Input 
                                id="socialUsername"
                                placeholder="Username"
                                value={newSocialMedia.username}
                                onChange={(e) => handleSocialMediaChange('username', e.target.value)}
                              />
                            </div>
                            
                            <div className="flex items-center space-x-2 pt-2">
                              <Checkbox 
                                id="socialActive" 
                                checked={newSocialMedia.active || false}
                                onCheckedChange={(checked) => 
                                  handleSocialMediaChange('active', checked === true)
                                }
                              />
                              <Label 
                                htmlFor="socialActive"
                                className="text-sm font-medium leading-none"
                              >
                                Active
                              </Label>
                            </div>
                            
                            <Button onClick={addSocialMedia} className="w-full mt-2">
                              <Plus className="mr-2 h-4 w-4" /> Add Social Media
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="resources" className="m-0 space-y-6">
                      <div className="space-y-3">
                        <Label>Resource Bookings</Label>
                        <div className="space-y-4">
                          {(formData.resourceBookings || []).map((booking, index) => (
                            <div key={index} className="flex items-center space-x-2 p-3 border rounded-md">
                              <div className="flex-1">
                                <p className="font-medium">{booking.purpose}</p>
                                <p className="text-sm text-muted-foreground">
                                  Resource ID: {booking.resourceId} | 
                                  Status: {booking.status}
                                </p>
                                <p className="text-xs">
                                  {new Date(booking.startDateTime).toLocaleString()} - {new Date(booking.endDateTime).toLocaleString()}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeResourceBooking(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="space-y-3 p-3 border rounded-md">
                            <div className="space-y-2">
                              <Label htmlFor="resourceId">Resource ID</Label>
                              <Input 
                                id="resourceId"
                                placeholder="Resource ID"
                                value={newResourceBooking.resourceId}
                                onChange={(e) => handleResourceBookingChange('resourceId', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="bookingPurpose">Purpose</Label>
                              <Input 
                                id="bookingPurpose"
                                placeholder="Booking purpose"
                                value={newResourceBooking.purpose}
                                onChange={(e) => handleResourceBookingChange('purpose', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="bookingStartDate">Start Date/Time</Label>
                                <Input 
                                  id="bookingStartDate"
                                  type="datetime-local"
                                  value={formatDateForInput(newResourceBooking.startDateTime)}
                                  onChange={(e) => handleResourceBookingChange('startDateTime', new Date(e.target.value))}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="bookingEndDate">End Date/Time</Label>
                                <Input 
                                  id="bookingEndDate"
                                  type="datetime-local"
                                  value={formatDateForInput(newResourceBooking.endDateTime)}
                                  onChange={(e) => handleResourceBookingChange('endDateTime', new Date(e.target.value))}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="bookingStatus">Status</Label>
                              <Select 
                                value={newResourceBooking.status as string}
                                onValueChange={(value) => handleResourceBookingChange('status', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="approved">Approved</SelectItem>
                                  <SelectItem value="rejected">Rejected</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <Button onClick={addResourceBooking} className="w-full mt-2">
                              <Plus className="mr-2 h-4 w-4" /> Add Resource Booking
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="m-0 space-y-4">
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
                </ScrollArea>
              </div>
            </Tabs>
          </div>
        )}
        
        <DialogFooter className="mt-4 pt-2 border-t shrink-0">
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

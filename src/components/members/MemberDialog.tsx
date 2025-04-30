import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Member, MemberCategory, ChurchStructure, Position, MemberStatus, MentorshipProgram, Volunteer, SocialMediaAccount, ResourceBooking } from '@/types';
import { useAppContext } from '@/context/AppContext';
import { Check, Plus, X, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/lib/toast';

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member?: Member;
}

const MemberDialog: React.FC<MemberDialogProps> = ({ 
  open, 
  onOpenChange,
  member 
}) => {
  const { addMember, updateMember } = useAppContext();
  
  // Convert Date objects to strings for form inputs
  const getDateString = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  };

  // Prepare form state
  const [formState, setFormState] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    status: 'active',
    category: 'member',
    // Safely handle date conversion
    joinDate: '',
    newMemberDate: '',
    occupation: '',
    skills: [],
    interests: [],
    isActive: true,
    isLeadership: false,
    isFullMember: false,
    structures: [],
    positions: [],
    attendance: [],
    attachments: [],
    mentorshipPrograms: [],
    volunteerRoles: [],
    socialMediaAccounts: [],
    resourceBookings: [],
    notes: ''
  });

  // Reset form when dialog closes or opens with a different member
  useEffect(() => {
    if (open) {
      if (member) {
        // Convert actual dates to string format for inputs
        const joinDateStr = getDateString(member.joinDate);
        const newMemberDateStr = getDateString(member.newMemberDate);

        setFormState({
          ...member,
          joinDate: joinDateStr,
          newMemberDate: newMemberDateStr,
          attachments: member.attachments || [],
          mentorshipPrograms: member.mentorshipPrograms || [],
          volunteerRoles: member.volunteerRoles || [],
          socialMediaAccounts: member.socialMediaAccounts || [],
          resourceBookings: member.resourceBookings || []
        });
      } else {
        setFormState({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          state: '',
          zip: '',
          status: 'active',
          category: 'member',
          joinDate: new Date().toISOString().split('T')[0],
          occupation: '',
          skills: [],
          interests: [],
          isActive: true,
          isLeadership: false,
          isFullMember: false,
          structures: [],
          positions: [],
          attendance: [],
          attachments: [],
          mentorshipPrograms: [],
          volunteerRoles: [],
          socialMediaAccounts: [],
          resourceBookings: [],
          notes: ''
        });
      }
    }
  }, [open, member]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormState(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Handle array field changes (like skills, interests)
  const handleArrayChange = (name: string, value: string) => {
    setFormState(prev => {
      const currentArray = prev[name] as string[] || [];
      if (value && !currentArray.includes(value)) {
        return { ...prev, [name]: [...currentArray, value] };
      }
      return prev;
    });
  };

  // Remove item from array field
  const handleArrayRemove = (name: string, index: number) => {
    setFormState(prev => {
      const currentArray = prev[name] as string[] || [];
      return {
        ...prev,
        [name]: currentArray.filter((_, i) => i !== index)
      };
    });
  };

  // Handle positions array changes
  const handlePositionAdd = (position: { title: string; structure: string }) => {
    if (!position.title || !position.structure) return;
    
    setFormState(prev => {
      const currentPositions = prev.positions || [];
      return {
        ...prev,
        positions: [...currentPositions, position]
      };
    });
  };

  // Handle mentorship programs
  const handleMentorshipAdd = (program: string) => {
    if (!program) return;
    
    setFormState(prev => {
      const currentPrograms = prev.mentorshipPrograms || [];
      return {
        ...prev,
        mentorshipPrograms: [...currentPrograms, { id: Date.now().toString(), name: program }]
      };
    });
  };

  const handleMentorshipRemove = (index: number) => {
    setFormState(prev => {
      const currentPrograms = prev.mentorshipPrograms || [];
      return {
        ...prev,
        mentorshipPrograms: currentPrograms.filter((_, i) => i !== index)
      };
    });
  };

  // Handle volunteer roles
  const handleVolunteerAdd = (role: string) => {
    if (!role) return;
    
    setFormState(prev => {
      const currentRoles = prev.volunteerRoles || [];
      return {
        ...prev,
        volunteerRoles: [...currentRoles, { id: Date.now().toString(), role }]
      };
    });
  };

  const handleVolunteerRemove = (index: number) => {
    setFormState(prev => {
      const currentRoles = prev.volunteerRoles || [];
      return {
        ...prev,
        volunteerRoles: currentRoles.filter((_, i) => i !== index)
      };
    });
  };

  // Handle social media accounts
  const handleSocialMediaAdd = (platform: string) => {
    if (!platform) return;
    
    setFormState(prev => {
      const currentAccounts = prev.socialMediaAccounts || [];
      return {
        ...prev,
        socialMediaAccounts: [...currentAccounts, { id: Date.now().toString(), platform }]
      };
    });
  };

  const handleSocialMediaRemove = (index: number) => {
    setFormState(prev => {
      const currentAccounts = prev.socialMediaAccounts || [];
      return {
        ...prev,
        socialMediaAccounts: currentAccounts.filter((_, i) => i !== index)
      };
    });
  };

  // Handle resource bookings
  const handleResourceAdd = (resource: string) => {
    if (!resource) return;
    
    setFormState(prev => {
      const currentBookings = prev.resourceBookings || [];
      return {
        ...prev,
        resourceBookings: [...currentBookings, { id: Date.now().toString(), resource }]
      };
    });
  };

  const handleResourceRemove = (index: number) => {
    setFormState(prev => {
      const currentBookings = prev.resourceBookings || [];
      return {
        ...prev,
        resourceBookings: currentBookings.filter((_, i) => i !== index)
      };
    });
  };

  // Handle form submission
  const handleSubmit = () => {
    const { firstName, lastName, email } = formState;
    
    // Basic validation
    if (!firstName || !lastName || !email) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      // Process form data for submission
      const memberData = {
        ...formState,
        // Convert string dates to Date objects if needed by your backend
        joinDate: formState.joinDate || '',
        newMemberDate: formState.newMemberDate || '',
        attachments: formState.attachments,
        mentorshipPrograms: formState.mentorshipPrograms,
        volunteerRoles: formState.volunteerRoles,
        socialMediaAccounts: formState.socialMediaAccounts,
        resourceBookings: formState.resourceBookings
      };
      
      if (member) {
        // Update existing member
        const userData = {
          ...formState,
          joinDate: formState.joinDate || '',
          attachments: formState.attachments
        } as unknown as Partial<Member>;
        
        updateMember(member.id, userData);
        toast.success("Member updated successfully");
      } else {
        // Create new member
        const userData = memberData as unknown as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>;
        
        addMember(userData);
        toast.success("Member added successfully");
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error("Error saving member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{member ? "Edit Member" : "Add Member"}</DialogTitle>
          <DialogDescription>
            {member ? "Edit member details" : "Create a new member profile"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                value={formState.firstName || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                value={formState.lastName || ""}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formState.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                value={formState.phone || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                name="address"
                id="address"
                value={formState.address || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                type="date"
                name="joinDate"
                id="joinDate"
                value={formState.joinDate || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="city">City</Label>
              <Input
                type="text"
                name="city"
                id="city"
                value={formState.city || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state">State</Label>
              <Input
                type="text"
                name="state"
                id="state"
                value={formState.state || ""}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="zip">ZIP Code</Label>
              <Input
                type="text"
                name="zip"
                id="zip"
                value={formState.zip || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                name="status"
                onValueChange={(value) => setFormState(prev => ({ ...prev, status: value }))}
                defaultValue={formState.status || "active"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="prospect">Prospect</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                onValueChange={(value) => setFormState(prev => ({ ...prev, category: value }))}
                defaultValue={formState.category || "member"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="new">New Member</SelectItem>
                  <SelectItem value="leader">Leader</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              type="text"
              name="occupation"
              id="occupation"
              value={formState.occupation || ""}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              name="notes"
              id="notes"
              value={formState.notes || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              name="isActive"
              checked={formState.isActive || false}
              onCheckedChange={(checked) => handleCheckboxChange("isActive", checked === true)}
            />
            <Label htmlFor="isActive">Is Active</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isLeadership"
              name="isLeadership"
              checked={formState.isLeadership || false}
              onCheckedChange={(checked) => handleCheckboxChange("isLeadership", checked === true)}
            />
            <Label htmlFor="isLeadership">Is Leadership</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFullMember"
              name="isFullMember"
              checked={formState.isFullMember || false}
              onCheckedChange={(checked) => handleCheckboxChange("isFullMember", checked === true)}
            />
            <Label htmlFor="isFullMember">Is Full Member</Label>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {member ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;

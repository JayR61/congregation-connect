import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (memberData: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
  member?: Member;
  memberId?: string;
}

export const MemberDialog: React.FC<MemberDialogProps> = ({ open, onOpenChange, onSave, member, memberId }) => {
  const { members, addMember, updateMember } = useAppContext();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    skills: [], 
    roles: [], 
    ministries: [], 
    dateOfBirth: undefined,
    joinDate: new Date(),
    city: '',
    state: '',
    zip: '',
    occupation: '',
    isLeadership: false,
    isFullMember: true,
    familyId: null,
    category: '',
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newMinistry, setNewMinistry] = useState('');
  
  // Load member data if editing
  useEffect(() => {
    if (member && open) {
      setFormData({
        ...member,
        // Ensure arrays are initialized
        skills: member.skills || [],
        roles: member.roles || [],
        ministries: member.ministries || [],
      });
    } else if (memberId && open) {
      const foundMember = members.find(m => m.id === memberId);
      if (foundMember) {
        setFormData({
          ...foundMember,
          // Ensure arrays are initialized
          skills: foundMember.skills || [],
          roles: foundMember.roles || [],
          ministries: foundMember.ministries || [],
        });
      }
    } else if (open && !member && !memberId) {
      // Reset form when opening for a new member
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        status: 'active',
        skills: [],
        roles: [],
        ministries: [],
        dateOfBirth: undefined,
        joinDate: new Date(),
        city: '',
        state: '',
        zip: '',
        occupation: '',
        isLeadership: false,
        isFullMember: true,
        familyId: null,
        category: '',
      });
      setNewSkill('');
      setNewMinistry('');
    }
  }, [member, memberId, open, members]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [name]: date }));
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && formData.skills) {
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()]
      }));
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter(s => s !== skill)
    }));
  };
  
  const handleAddMinistry = () => {
    if (newMinistry.trim() && formData.ministries) {
      setFormData(prev => ({
        ...prev,
        ministries: [...(prev.ministries || []), newMinistry.trim()]
      }));
      setNewMinistry('');
    }
  };
  
  const handleRemoveMinistry = (ministry: string) => {
    setFormData(prev => ({
      ...prev,
      ministries: (prev.ministries || []).filter(m => m !== ministry)
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    if (memberId || member) {
      // Update existing member - partial update is fine
      const memberToUpdate = member || members.find(m => m.id === memberId);
      if (memberToUpdate) {
        updateMember(memberToUpdate.id, formData);
      }
    } else if (onSave) {
      // Use the onSave callback if provided
      const newMemberData = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        dateOfBirth: formData.dateOfBirth,
        joinDate: formData.joinDate || new Date(),
        status: formData.status || 'active',
        skills: formData.skills || [],
        roles: formData.roles || [],
        ministries: formData.ministries || [],
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        occupation: formData.occupation,
        isLeadership: formData.isLeadership,
        isFullMember: formData.isFullMember,
        familyId: formData.familyId,
        category: formData.category,
      };
      onSave(newMemberData);
    } else {
      // Create new member directly
      const newMemberData = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        phone: formData.phone || '',
        address: formData.address || '',
        dateOfBirth: formData.dateOfBirth,
        joinDate: formData.joinDate || new Date(),
        status: formData.status || 'active',
        skills: formData.skills || [],
        roles: formData.roles || [],
        ministries: formData.ministries || [],
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        occupation: formData.occupation,
        isLeadership: formData.isLeadership,
        isFullMember: formData.isFullMember,
        familyId: formData.familyId,
        category: formData.category,
      };
      addMember(newMemberData);
    }
    
    toast({
      title: `Member ${memberId ? 'updated' : 'created'} successfully`,
      description: `${formData.firstName} ${formData.lastName} has been ${memberId ? 'updated' : 'added'} to the system.`
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{memberId ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {memberId ? 'Update member information' : 'Enter details for the new member'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
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
          
          <div className="space-y-2">
            <Label htmlFor="category">Member Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Visitor, Sponsor, Volunteer, Admin, etc."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  handleDateChange('dateOfBirth', date);
                }}
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                id="joinDate"
                name="joinDate"
                type="date"
                value={formData.joinDate ? format(formData.joinDate, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  handleDateChange('joinDate', date);
                }}
                max={format(new Date(), "yyyy-MM-dd")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State/Province</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip">Postal Code</Label>
              <Input
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills && formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSkill}>Add</Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Ministries</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.ministries && formData.ministries.map((ministry) => (
                <Badge key={ministry} variant="secondary" className="flex items-center gap-1">
                  {ministry}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveMinistry(ministry)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newMinistry}
                onChange={(e) => setNewMinistry(e.target.value)}
                placeholder="Add a ministry"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddMinistry}>Add</Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isLeadership"
              checked={formData.isLeadership}
              onChange={(e) => handleCheckboxChange('isLeadership', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isLeadership">Leadership Position</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFullMember"
              checked={formData.isFullMember}
              onChange={(e) => handleCheckboxChange('isFullMember', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isFullMember">Full Member</Label>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="familyId">Family Member</Label>
            <Select
              value={formData.familyId || ''}
              onValueChange={(value) => handleSelectChange('familyId', value === 'none' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select family member (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No family link</SelectItem>
                {members
                  .filter(member => member.id !== memberId) // Don't show current member
                  .map(member => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {memberId ? 'Update Member' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Add a default export that re-exports the named export
export default MemberDialog;

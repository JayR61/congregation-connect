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
import { toast } from '@/lib/toast';

interface MemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId?: string;
}

export const MemberDialog: React.FC<MemberDialogProps> = ({ open, onOpenChange, memberId }) => {
  const { members, addMember, updateMember } = useAppContext();
  
  // Form state
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    skills: [], // Initialize as an empty array
    roles: [], // Initialize as an empty array
    ministries: [], // Initialize as an empty array
    dateOfBirth: undefined,
    joinDate: new Date(),
    city: '',
    state: '',
    zip: '',
    occupation: '',
    isLeadership: false,
    isFullMember: true,
    familyId: null,
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [newMinistry, setNewMinistry] = useState('');
  
  // Load member data if editing
  useEffect(() => {
    if (memberId && open) {
      const member = members.find(m => m.id === memberId);
      if (member) {
        setFormData({
          ...member,
          // Ensure arrays are initialized
          skills: member.skills || [],
          roles: member.roles || [],
          ministries: member.ministries || [],
        });
      }
    } else if (open) {
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
      });
      setNewSkill('');
      setNewMinistry('');
    }
  }, [memberId, open, members]);
  
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
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (memberId) {
      // Update existing member - partial update is fine
      updateMember(memberId, formData);
    } else {
      // Create new member - need to ensure all required fields are present
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
      };
      addMember(newMemberData);
    }
    
    toast.success(`Member ${memberId ? 'updated' : 'created'} successfully`);
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth}
                    onSelect={(date) => handleDateChange('dateOfBirth', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.joinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.joinDate ? format(formData.joinDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.joinDate}
                    onSelect={(date) => handleDateChange('joinDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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

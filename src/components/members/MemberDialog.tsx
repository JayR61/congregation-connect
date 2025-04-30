import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';
import { Member } from '@/types';
import { MemberDialogProps } from './MemberDialogProps';

const MemberDialog: React.FC<MemberDialogProps> = ({ 
  open, 
  onOpenChange, 
  member, 
  onSave 
}) => {
  const { members, addMember, updateMember } = useAppContext();
  const isEditing = !!member;
  
  const [formData, setFormData] = useState<Partial<Member>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    joinDate: new Date(),
    birthDate: new Date(),
    occupation: '',
    skills: [],
    notes: '',
    category: 'regular',
    isActive: true,
    isFullMember: false,
    structures: [],
    positions: []
  });
  
  const [newSkill, setNewSkill] = useState('');
  const [familyMembers, setFamilyMembers] = useState<string[]>([]);
  const [newPosition, setNewPosition] = useState({ title: '', structure: '' });
  
  useEffect(() => {
    if (member) {
      setFormData({
        ...member,
        joinDate: member.joinDate ? new Date(member.joinDate) : new Date(),
        birthDate: member.birthDate ? new Date(member.birthDate) : new Date(),
      });
      
      setFamilyMembers(member.familyIds || []);
    } else {
      resetForm();
    }
  }, [member, open]);
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      status: 'active',
      joinDate: new Date(),
      birthDate: new Date(),
      occupation: '',
      skills: [],
      notes: '',
      category: 'regular',
      isActive: true,
      isFullMember: false,
      structures: [],
      positions: []
    });
    setFamilyMembers([]);
    setNewSkill('');
    setNewPosition({ title: '', structure: '' });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if (date) {
      setFormData(prev => ({ ...prev, [name]: date }));
    }
  };
  
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
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
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };
  
  const handleAddPosition = () => {
    if (newPosition.title && newPosition.structure) {
      setFormData(prev => ({
        ...prev,
        positions: [...(prev.positions || []), { ...newPosition }]
      }));
      setNewPosition({ title: '', structure: '' });
    }
  };
  
  const handleRemovePosition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions?.filter((_, i) => i !== index) || []
    }));
  };
  
  const handleToggleFamilyMember = (memberId: string) => {
    if (familyMembers.includes(memberId)) {
      setFamilyMembers(prev => prev.filter(id => id !== memberId));
    } else {
      setFamilyMembers(prev => [...prev, memberId]);
    }
  };
  
  const handleSubmit = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      // Show error
      return;
    }
    
    const memberData = {
      ...formData,
      familyIds: familyMembers.length > 0 ? familyMembers : undefined
    };
    
    if (isEditing && member) {
      updateMember(member.id, memberData);
      if (onSave) {
        onSave({ ...member, ...memberData } as Member);
      }
    } else {
      const newMember = addMember(memberData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
      if (onSave) {
        onSave(newMember);
      }
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Member' : 'Add New Member'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update member information in the system.' 
              : 'Add a new member to the system.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'active'}
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
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category || 'regular'}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="visitor">Visitor</SelectItem>
                  <SelectItem value="youth">Youth</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="elder">Elder</SelectItem>
                  <SelectItem value="pastor">Pastor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Join Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.joinDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.joinDate ? format(formData.joinDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.joinDate}
                    onSelect={(date) => handleDateChange('joinDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Birth Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.birthDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.birthDate ? format(formData.birthDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.birthDate}
                    onSelect={(date) => handleDateChange('birthDate', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              name="occupation"
              value={formData.occupation || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Skills</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills?.map((skill) => (
                <div key={skill} className="flex items-center bg-muted rounded-md px-2 py-1">
                  <span className="text-sm">{skill}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="flex-1"
              />
              <Button type="button" onClick={handleAddSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Positions</Label>
            <div className="space-y-2 mb-2">
              {formData.positions?.map((position, index) => (
                <div key={index} className="flex items-center justify-between bg-muted rounded-md px-3 py-2">
                  <div>
                    <span className="font-medium">{position.title}</span>
                    <span className="text-sm text-muted-foreground ml-2">({position.structure})</span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemovePosition(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Input
                value={newPosition.title}
                onChange={(e) => setNewPosition({ ...newPosition, title: e.target.value })}
                placeholder="Position title"
              />
              <Select
                value={newPosition.structure}
                onValueChange={(value) => setNewPosition({ ...newPosition, structure: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Structure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="senior_leadership">Senior Leadership</SelectItem>
                  <SelectItem value="youth_leadership">Youth Leadership</SelectItem>
                  <SelectItem value="worship_team">Worship Team</SelectItem>
                  <SelectItem value="children_ministry">Children Ministry</SelectItem>
                  <SelectItem value="outreach">Outreach</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddPosition}
              disabled={!newPosition.title || !newPosition.structure}
            >
              Add Position
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleCheckboxChange('isActive', checked === true)}
              />
              <Label htmlFor="isActive">Active Member</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFullMember"
                checked={formData.isFullMember}
                onCheckedChange={(checked) => handleCheckboxChange('isFullMember', checked === true)}
              />
              <Label htmlFor="isFullMember">Full Member</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {members.length > 0 && (
            <div className="space-y-2">
              <Label>Family Members</Label>
              <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                {members
                  .filter(m => !member || m.id !== member.id)
                  .map(m => (
                    <div key={m.id} className="flex items-center space-x-2 py-1">
                      <Checkbox
                        id={`family-${m.id}`}
                        checked={familyMembers.includes(m.id)}
                        onCheckedChange={() => handleToggleFamilyMember(m.id)}
                      />
                      <Label htmlFor={`family-${m.id}`} className="cursor-pointer">
                        {m.firstName} {m.lastName}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditing ? 'Update Member' : 'Add Member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MemberDialog;

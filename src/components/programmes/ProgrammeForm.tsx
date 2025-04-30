
import React, { useState, useEffect } from 'react';
import { Programme } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from '@/lib/toast';

export interface ProgrammeFormProps {
  onSave: (programmeData: Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>) => void;
  onCancel: () => void;
  initialData: Partial<Programme> | {}; 
  isEditing: boolean;
}

const ProgrammeForm = ({ onSave, onCancel, initialData, isEditing }: ProgrammeFormProps) => {
  const [formData, setFormData] = useState<Partial<Programme>>({
    name: '',
    title: '',
    description: '',
    startDate: new Date(),
    endDate: null,
    location: '',
    type: 'ministry',
    category: 'general',
    tags: [],
    targetAudience: '',
    capacity: 30,
    coordinator: '',
    budget: 0,
    status: 'active',
    objectives: [],
    kpis: [],
    notes: '',
    recurring: false,
    frequency: 'weekly',
    ...initialData
  });

  useEffect(() => {
    // Convert date strings to Date objects if needed
    if (typeof formData.startDate === 'string') {
      setFormData(prev => ({ ...prev, startDate: new Date(prev.startDate as string) }));
    }
    
    if (formData.endDate && typeof formData.endDate === 'string') {
      setFormData(prev => ({ ...prev, endDate: new Date(prev.endDate as string) }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? new Date(value) : null }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.description || !formData.startDate || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Submit as Programme without id, currentAttendees, and attendees
    const programmeData = {
      ...formData,
      name: formData.name || '',
      title: formData.title || formData.name || '',
      description: formData.description || '',
      startDate: formData.startDate || new Date(),
      location: formData.location || '',
      type: formData.type || 'ministry',
      category: formData.category || 'general',
      tags: formData.tags || [],
      targetAudience: formData.targetAudience || '',
      capacity: formData.capacity || 30,
      budget: formData.budget || 0,
      status: formData.status || 'active',
      objectives: formData.objectives || [],
      kpis: formData.kpis || [],
      notes: formData.notes || '',
      coordinator: formData.coordinator || '',
      recurring: formData.recurring || false,
      frequency: formData.frequency || 'weekly'
    } as Omit<Programme, 'id' | 'currentAttendees' | 'attendees'>;
    
    onSave(programmeData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Programme' : 'Create New Programme'}</h2>
        <p className="text-muted-foreground">
          {isEditing 
            ? 'Update the details of your existing church programme' 
            : 'Add a new church programme by filling out the details below'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input 
            id="name"
            name="name"
            value={formData.name || ''} 
            onChange={handleChange}
            placeholder="Programme name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select 
            value={formData.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ministry">Ministry</SelectItem>
              <SelectItem value="counseling">Counseling</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="training">Training</SelectItem>
              <SelectItem value="outreach">Outreach</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea 
          id="description"
          name="description"
          value={formData.description || ''} 
          onChange={handleChange}
          placeholder="Programme description"
          rows={3}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date *</Label>
          <Input 
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate ? new Date(formData.startDate).toISOString().split('T')[0] : ''} 
            onChange={handleDateChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input 
            id="endDate"
            name="endDate"
            type="date"
            value={formData.endDate ? new Date(formData.endDate).toISOString().split('T')[0] : ''} 
            onChange={handleDateChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input 
            id="location"
            name="location"
            value={formData.location || ''} 
            onChange={handleChange}
            placeholder="Programme location"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="coordinator">Coordinator</Label>
          <Input 
            id="coordinator"
            name="coordinator"
            value={formData.coordinator || ''} 
            onChange={handleChange}
            placeholder="Programme coordinator"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input 
            id="category"
            name="category"
            value={formData.category || ''} 
            onChange={handleChange}
            placeholder="Programme category"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="targetAudience">Target Audience</Label>
          <Input 
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience || ''} 
            onChange={handleChange}
            placeholder="Target audience"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input 
            id="capacity"
            name="capacity"
            type="number"
            value={formData.capacity || 0} 
            onChange={handleNumberChange}
            placeholder="Maximum capacity"
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input 
            id="budget"
            name="budget"
            type="number"
            value={formData.budget || 0} 
            onChange={handleNumberChange}
            placeholder="Budget amount"
            min={0}
            step={0.01}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="recurring">Recurring Programme</Label>
          <Switch 
            id="recurring" 
            checked={formData.recurring || false}
            onCheckedChange={(checked) => handleToggleChange('recurring', checked)}
          />
        </div>
        
        {formData.recurring && (
          <div className="mt-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select 
              value={formData.frequency}
              onValueChange={(value) => handleSelectChange('frequency', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes"
          name="notes"
          value={formData.notes || ''} 
          onChange={handleChange}
          placeholder="Any additional information"
          rows={2}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update Programme' : 'Create Programme'}
        </Button>
      </div>
    </form>
  );
};

export { ProgrammeForm };
export default ProgrammeForm;

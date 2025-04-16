
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Clock, Copy, Trash2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Programme, ProgrammeTemplate } from '@/types';

interface TemplateManagerProps {
  templates: ProgrammeTemplate[];
  onCreateTemplate: (template: Omit<ProgrammeTemplate, 'id' | 'createdById' | 'createdAt'>) => ProgrammeTemplate | null;
  onCreateFromTemplate: (templateId: string, overrideData: Partial<Programme>) => Programme | null;
}

export const TemplateManager = ({ 
  templates,
  onCreateTemplate,
  onCreateFromTemplate
}: TemplateManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUseTemplateDialogOpen, setIsUseTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ProgrammeTemplate | null>(null);
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    type: 'ministry',
    duration: 60,
    capacity: 20,
    resources: [
      { name: '', type: 'room' as const, quantity: 1, unit: '', cost: undefined, notes: '', status: 'allocated' as const }
    ]
  });
  
  const [useTemplateForm, setUseTemplateForm] = useState({
    startDate: new Date(),
    location: '',
    coordinator: ''
  });
  
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      type: 'ministry',
      duration: 60,
      capacity:.20,
      resources: [
        { name: '', type: 'room', quantity: 1, unit: '', cost: undefined, notes: '', status: 'allocated' }
      ]
    });
  };
  
  const resetUseTemplateForm = () => {
    setUseTemplateForm({
      startDate: new Date(),
      location: '',
      coordinator: ''
    });
    setSelectedTemplate(null);
  };
  
  const handleAddResource = () => {
    setForm(prev => ({
      ...prev,
      resources: [
        ...prev.resources,
        { name: '', type: 'room', quantity: 1, unit: '', cost: undefined, notes: '', status: 'allocated' }
      ]
    }));
  };
  
  const handleRemoveResource = (index: number) => {
    setForm(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };
  
  const handleResourceChange = (index: number, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) => 
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };
  
  const handleSubmit = () => {
    const cleanedResources = form.resources.filter(r => r.name.trim() !== '');
    
    onCreateTemplate({
      ...form,
      resources: cleanedResources
    });
    
    setIsDialogOpen(false);
    resetForm();
  };
  
  const handleUseTemplate = () => {
    if (!selectedTemplate) return;
    
    onCreateFromTemplate(selectedTemplate.id, useTemplateForm);
    
    setIsUseTemplateDialogOpen(false);
    resetUseTemplateForm();
  };
  
  const openUseTemplateDialog = (template: ProgrammeTemplate) => {
    setSelectedTemplate(template);
    setIsUseTemplateDialogOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Programme Templates</h2>
          <p className="text-muted-foreground">
            Create reusable templates for common programmes.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Template
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-4">No templates defined yet.</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Your First Template
              </Button>
            </CardContent>
          </Card>
        ) : (
          templates.map(template => (
            <Card key={template.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Type:</span>
                      <span>{template.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Duration:</span>
                      <span>{template.duration} minutes</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Capacity:</span>
                      <span>{template.capacity} people</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Resources:</span>
                      <span>{template.resources.length} items</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => openUseTemplateDialog(template)}
                    >
                      <Copy className="mr-2 h-4 w-4" /> Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
      {/* Create Template Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Programme Template</DialogTitle>
            <DialogDescription>
              Create a reusable template for common programmes.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] overflow-y-auto pr-4">
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select 
                    value={form.type} 
                    onValueChange={(value) => setForm(prev => ({ ...prev, type: value }))}
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
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
                    placeholder="Enter capacity"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter duration in minutes"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Resources</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddResource}
                    type="button"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" /> Add Resource
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {form.resources.map((resource, index) => (
                    <div key={index} className="border rounded-md p-3 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Resource {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveResource(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div>
                        <Label htmlFor={`resource-name-${index}`}>Name</Label>
                        <Input
                          id={`resource-name-${index}`}
                          value={resource.name}
                          onChange={(e) => handleResourceChange(index, 'name', e.target.value)}
                          placeholder="Enter resource name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`resource-type-${index}`}>Type</Label>
                          <Select 
                            value={resource.type} 
                            onValueChange={(value) => handleResourceChange(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="room">Room</SelectItem>
                              <SelectItem value="equipment">Equipment</SelectItem>
                              <SelectItem value="personnel">Personnel</SelectItem>
                              <SelectItem value="budget">Budget</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor={`resource-quantity-${index}`}>Quantity</Label>
                          <Input
                            id={`resource-quantity-${index}`}
                            type="number"
                            value={resource.quantity}
                            onChange={(e) => handleResourceChange(index, 'quantity', parseInt(e.target.value) || 1)}
                            placeholder="Quantity"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!form.name}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Use Template Dialog */}
      <Dialog open={isUseTemplateDialogOpen} onOpenChange={setIsUseTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Use Template: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Create a new programme using this template.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !useTemplateForm.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {useTemplateForm.startDate ? (
                      format(useTemplateForm.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={useTemplateForm.startDate}
                    onSelect={(date) => date && setUseTemplateForm(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={useTemplateForm.location}
                onChange={(e) => setUseTemplateForm(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Enter location"
              />
            </div>
            
            <div>
              <Label htmlFor="coordinator">Coordinator</Label>
              <Input
                id="coordinator"
                value={useTemplateForm.coordinator}
                onChange={(e) => setUseTemplateForm(prev => ({ ...prev, coordinator: e.target.value }))}
                placeholder="Enter coordinator name"
              />
            </div>
            
            {selectedTemplate && (
              <div className="border rounded-md p-3 bg-muted/30">
                <h4 className="font-medium mb-2">Template Details</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Type:</span> {selectedTemplate.type}</p>
                  <p><span className="font-medium">Duration:</span> {selectedTemplate.duration} minutes</p>
                  <p><span className="font-medium">Capacity:</span> {selectedTemplate.capacity} people</p>
                  <p><span className="font-medium">Resources:</span> {selectedTemplate.resources.length} items</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUseTemplateDialogOpen(false);
              resetUseTemplateForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleUseTemplate}
              disabled={
                !useTemplateForm.location || 
                !useTemplateForm.coordinator
              }
            >
              Create Programme
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

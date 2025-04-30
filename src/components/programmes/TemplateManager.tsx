
import React, { useState } from 'react';
import { Programme, ProgrammeTemplate } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Check, FileText, Plus, Recycle } from "lucide-react";
import { toast } from '@/lib/toast';

export interface TemplateManagerProps {
  templates: ProgrammeTemplate[];
  onCreateTemplate: (template: Omit<ProgrammeTemplate, 'id' | 'createdAt'>) => any;
  onCreateFromTemplate: (templateId: string) => any;
}

// This is a minimal stub to fix export issues
export const createTemplate = () => {
  return {
    name: "Example Template",
    title: "Example Title",
    description: "Example Description",
    type: "Example Type", 
    content: "",
    category: "",
    tags: [],
    duration: 60,
    capacity: 20,
    resources: [{
      name: "Example Resource",
      type: "document",
      quantity: 1,
      unit: "piece",
      cost: 0,
      notes: "",
      status: "allocated"
    }],
    createdById: "user-1"
  };
};

const TemplateManager = ({ templates, onCreateTemplate, onCreateFromTemplate }: TemplateManagerProps) => {
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [isUseTemplateDialogOpen, setIsUseTemplateDialogOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<ProgrammeTemplate>>({
    name: '',
    title: '',
    description: '',
    type: 'ministry',
    content: '',
    category: '',
    tags: [],
    duration: 60,
    capacity: 20,
    resources: [],
    createdById: 'user-1'
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.title || !newTemplate.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    onCreateTemplate({
      ...newTemplate,
      name: newTemplate.name || '',
      title: newTemplate.title || '',
      description: newTemplate.description || '',
      type: newTemplate.type || 'ministry',
      content: newTemplate.content || '',
      category: newTemplate.category || '',
      tags: newTemplate.tags || [],
      duration: newTemplate.duration || 60,
      capacity: newTemplate.capacity || 20,
      resources: newTemplate.resources || [],
      createdById: newTemplate.createdById || 'user-1'
    } as Omit<ProgrammeTemplate, 'id' | 'createdAt'>);

    setIsNewTemplateDialogOpen(false);
    setNewTemplate({
      name: '',
      title: '',
      description: '',
      type: 'ministry',
      content: '',
      category: '',
      tags: [],
      duration: 60,
      capacity: 20,
      resources: [],
      createdById: 'user-1'
    });
    toast.success("Template created successfully");
  };

  const handleUseTemplate = () => {
    if (!selectedTemplateId) {
      toast.error("Please select a template");
      return;
    }

    onCreateFromTemplate(selectedTemplateId);
    setIsUseTemplateDialogOpen(false);
    setSelectedTemplateId(null);
    toast.success("Programme created from template");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Programme Templates</h2>
          <p className="text-muted-foreground">Create and use templates for common programme types</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewTemplateDialogOpen} onOpenChange={setIsNewTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create Programme Template</DialogTitle>
                <DialogDescription>
                  Create a reusable template for common programme types
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Template Name
                  </Label>
                  <Input
                    id="name"
                    value={newTemplate.name || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Sunday School Template"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Programme Title
                  </Label>
                  <Input
                    id="title"
                    value={newTemplate.title || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Sunday School Session"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={newTemplate.type} 
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, type: value }))}
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
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Input
                    id="category"
                    value={newTemplate.category || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                    className="col-span-3"
                    placeholder="e.g., Education, Youth, Adult"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newTemplate.description || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    className="col-span-3"
                    placeholder="Template description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (min)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={newTemplate.duration || 60}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, duration: Number(e.target.value) }))}
                    className="col-span-3"
                    placeholder="Duration in minutes"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="capacity" className="text-right">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={newTemplate.capacity || 20}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                    className="col-span-3"
                    placeholder="Maximum capacity"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newTemplate.content || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    className="col-span-3"
                    placeholder="Programme content structure or outline"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewTemplateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isUseTemplateDialogOpen} onOpenChange={setIsUseTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Recycle className="h-4 w-4 mr-2" /> Use Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create Programme from Template</DialogTitle>
                <DialogDescription>
                  Select a template to create a new programme
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {templates.length > 0 ? (
                  <div className="space-y-4">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`p-4 border rounded-md cursor-pointer ${
                          selectedTemplateId === template.id ? 'border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedTemplateId(template.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          {selectedTemplateId === template.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          <Badge variant="secondary">{template.type}</Badge>
                          {template.category && <Badge variant="outline">{template.category}</Badge>}
                          <span className="text-xs text-muted-foreground ml-auto">{template.duration} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No templates available. Create one first.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsUseTemplateDialogOpen(false);
                        setIsNewTemplateDialogOpen(true);
                      }}
                      className="mt-2"
                    >
                      Create Template
                    </Button>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUseTemplateDialogOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleUseTemplate}
                  disabled={!selectedTemplateId}
                >
                  Create Programme
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(template => (
            <Card key={template.id} className="hover:bg-muted/50 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge>{template.type}</Badge>
                </div>
                <p className="text-muted-foreground">{template.title}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">{template.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Duration:</span> {template.duration} min
                    </div>
                    <div>
                      <span className="text-muted-foreground">Capacity:</span> {template.capacity}
                    </div>
                    {template.category && (
                      <div>
                        <span className="text-muted-foreground">Category:</span> {template.category}
                      </div>
                    )}
                    {template.resources && template.resources.length > 0 && (
                      <div>
                        <span className="text-muted-foreground">Resources:</span> {template.resources.length}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedTemplateId(template.id);
                    setIsUseTemplateDialogOpen(true);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" /> Use This Template
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/20">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No Templates Available</h3>
          <p className="text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
            Create templates to standardize your programmes and save time when setting up recurring events.
          </p>
          <Button onClick={() => setIsNewTemplateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Your First Template
          </Button>
        </div>
      )}
    </div>
  );
};

export { TemplateManager };
export default TemplateManager;

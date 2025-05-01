import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Member } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from '@/components/ui/use-toast';

interface MemberNotesProps {
  member: Member;
}

const MemberNotes: React.FC<MemberNotesProps> = ({ member }) => {
  const { updateMember, currentUser } = useAppContext();
  const [activeTab, setActiveTab] = useState<"notes" | "resources">("notes");
  const [newNote, setNewNote] = useState({
    content: "",
    category: "general",
    isPrivate: false
  });
  const [newResource, setNewResource] = useState({
    name: "",
    type: "book",
    description: "",
    details: "",
    value: 0
  });
  
  const handleAddNote = () => {
    if (!newNote.content) {
      toast({
        title: "Missing content",
        description: "Please enter some content for your note.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new note and update the member
    const updatedMember = { ...member };
    
    // Initialize memberNotes if it doesn't exist
    if (!updatedMember.memberNotes) {
      updatedMember.memberNotes = [];
    }
    
    // Add the new note
    updatedMember.memberNotes.push({
      id: `note-${Date.now()}`,
      content: newNote.content,
      date: new Date(),
      createdBy: currentUser.id,
      category: newNote.category,
      isPrivate: newNote.isPrivate,
      attachments: []
    });
    
    // Update the member
    updateMember(member.id, { memberNotes: updatedMember.memberNotes });
    
    // Reset the form
    setNewNote({
      content: "",
      category: "general",
      isPrivate: false
    });
    
    setActiveTab("notes");
    
    toast({
      title: "Note added",
      description: "The note has been successfully added."
    });
  };

  const handleAddResource = () => {
    if (!newResource.description || !newResource.type) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new resource and update the member
    const updatedMember = { ...member };
    
    // Initialize resourcesProvided if it doesn't exist
    if (!updatedMember.resourcesProvided) {
      updatedMember.resourcesProvided = [];
    }
    
    // Add the new resource
    updatedMember.resourcesProvided.push({
      id: `resource-${Date.now()}`,
      description: newResource.description,
      type: newResource.type,
      date: new Date(),
      providedById: currentUser.id,
      name: newResource.name || '',
      details: newResource.details || '',
      value: newResource.value,
      attachments: []
    });
    
    // Update the member
    updateMember(member.id, { resourcesProvided: updatedMember.resourcesProvided });
    
    // Reset the form
    setNewResource({
      name: "",
      type: "book",
      description: "",
      details: "",
      value: 0
    });
    
    setActiveTab("resources");
    
    toast({
      title: "Resource added",
      description: "The resource has been successfully added."
    });
  };
  
  return (
    <Tabs defaultValue="notes" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      
      <TabsContent value="notes">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="note-content">Note Content</Label>
            <Textarea
              id="note-content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Enter your note here"
            />
          </div>
          <div>
            <Label htmlFor="note-category">Category</Label>
            <Select
              value={newNote.category}
              onValueChange={(value) => setNewNote({ ...newNote, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="pastoral">Pastoral</SelectItem>
                <SelectItem value="follow-up">Follow-up</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="checkbox"
              id="note-isPrivate"
              checked={newNote.isPrivate}
              onChange={(e) => setNewNote({ ...newNote, isPrivate: e.target.checked })}
            />
            <Label htmlFor="note-isPrivate">Private</Label>
          </div>
          <Button onClick={handleAddNote}>Add Note</Button>
          
          {member.memberNotes && member.memberNotes.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-medium">Existing Notes</h4>
              <ul>
                {member.memberNotes.map((note) => (
                  <li key={note.id} className="py-2 border-b">
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground">
                      Category: {note.category}, Created: {note.date.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">No notes recorded for this member.</p>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="resources">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="resource-name">Resource Name</Label>
            <Input
              id="resource-name"
              value={newResource.name}
              onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
              placeholder="e.g., 'The Purpose Driven Life'"
            />
          </div>
          <div>
            <Label htmlFor="resource-type">Resource Type</Label>
            <Select
              value={newResource.type}
              onValueChange={(value) => setNewResource({ ...newResource, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a resource type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="course">Course</SelectItem>
                <SelectItem value="counseling">Counseling</SelectItem>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="resource-description">Description</Label>
            <Textarea
              id="resource-description"
              value={newResource.description}
              onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
              placeholder="Brief description of the resource"
            />
          </div>
          <div>
            <Label htmlFor="resource-details">Details</Label>
            <Input
              id="resource-details"
              value={newResource.details}
              onChange={(e) => setNewResource({ ...newResource, details: e.target.value })}
              placeholder="Additional details (e.g., URL, session times)"
            />
          </div>
          <div>
            <Label htmlFor="resource-value">Value (Optional)</Label>
            <Input
              type="number"
              id="resource-value"
              value={newResource.value}
              onChange={(e) => setNewResource({ ...newResource, value: Number(e.target.value) })}
              placeholder="Monetary value of the resource"
            />
          </div>
          <Button onClick={handleAddResource}>Add Resource</Button>
          
          {member.resourcesProvided && member.resourcesProvided.length > 0 ? (
            <div className="mt-4">
              <h4 className="text-lg font-medium">Resources Provided</h4>
              <ul>
                {member.resourcesProvided.map((resource) => (
                  <li key={resource.id} className="py-2 border-b">
                    <p className="text-sm">{resource.description}</p>
                    <p className="text-xs text-muted-foreground">
                      Type: {resource.type}, Date: {resource.date.toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground">No resources provided to this member.</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MemberNotes;

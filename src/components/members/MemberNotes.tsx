
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MemberNote, ResourceProvided, Member } from '@/types';
import { FileText, Plus, Edit2, Trash2, PenLine } from 'lucide-react';
import { toast } from '@/lib/toast';
import { useAppContext } from '@/context/AppContext';

interface MemberNotesProps {
  member: Member;
}

const MemberNotes: React.FC<MemberNotesProps> = ({ member }) => {
  const { updateMember, currentUser } = useAppContext();
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<MemberNote | null>(null);
  const [newResource, setNewResource] = useState({
    description: '',
    value: '',
    date: new Date().toISOString().split('T')[0],
  });
  
  const addNote = () => {
    if (!newNote.trim()) {
      toast.error("Note cannot be empty");
      return;
    }
    
    if (editingNote) {
      // Update existing note
      const updatedNotes = (member.memberNotes || []).map(note => 
        note.id === editingNote.id 
          ? { ...note, content: newNote, updatedAt: new Date() } 
          : note
      );
      
      updateMember(member.id, {
        memberNotes: updatedNotes
      });
      
      setEditingNote(null);
      toast.success("Note updated successfully");
    } else {
      // Add new note
      const memberNote: MemberNote = {
        id: `note-${Date.now()}`,
        content: newNote,
        date: new Date(),
        createdById: currentUser.id,
        attachments: [],
      };
      
      const updatedNotes = [...(member.memberNotes || []), memberNote];
      
      updateMember(member.id, {
        memberNotes: updatedNotes
      });
      
      toast.success("Note added successfully");
    }
    
    setNewNote('');
  };
  
  const editNote = (note: MemberNote) => {
    setNewNote(note.content);
    setEditingNote(note);
  };
  
  const deleteNote = (noteId: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      const updatedNotes = (member.memberNotes || []).filter(note => note.id !== noteId);
      
      updateMember(member.id, {
        memberNotes: updatedNotes
      });
      
      if (editingNote?.id === noteId) {
        setEditingNote(null);
        setNewNote('');
      }
      
      toast.success("Note deleted successfully");
    }
  };
  
  const addResourceRecord = () => {
    if (!newResource.description.trim()) {
      toast.error("Resource description cannot be empty");
      return;
    }
    
    const resource: ResourceProvided = {
      id: `resource-${Date.now()}`,
      description: newResource.description,
      date: new Date(newResource.date),
      value: newResource.value ? parseFloat(newResource.value) : undefined,
      createdById: currentUser.id,
      attachments: [],
    };
    
    const updatedResources = [...(member.resourcesProvided || []), resource];
    
    updateMember(member.id, {
      resourcesProvided: updatedResources
    });
    
    setNewResource({
      description: '',
      value: '',
      date: new Date().toISOString().split('T')[0],
    });
    
    toast.success("Resource record added successfully");
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Notes & Resources</CardTitle>
        <CardDescription>Track notes and resources provided to this member</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="notes">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="resources">Resources Provided</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notes" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newNote">{editingNote ? 'Edit Note' : 'New Note'}</Label>
              <Textarea
                id="newNote"
                placeholder="Add notes about this member..."
                className="min-h-[100px]"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={addNote} className="flex-1">
                  {editingNote ? <Edit2 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                  {editingNote ? 'Update Note' : 'Add Note'}
                </Button>
                {editingNote && (
                  <Button variant="outline" onClick={() => {
                    setEditingNote(null);
                    setNewNote('');
                  }}>
                    Cancel
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Note History</h3>
              {member.memberNotes && member.memberNotes.length > 0 ? (
                <ScrollArea className="h-[250px]">
                  <div className="space-y-3">
                    {[...member.memberNotes]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((note) => (
                        <div key={note.id} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
                            <div className="flex items-center">
                              <PenLine className="h-3.5 w-3.5 mr-1.5" />
                              <span>{formatDate(note.date)}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => editNote(note)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="whitespace-pre-line">{note.content}</p>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 border rounded-md">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">No Notes</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add notes about this member to keep track of important information.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 p-4 border rounded-md">
              <div className="space-y-2">
                <Label htmlFor="resourceDescription">Resource Description</Label>
                <Textarea
                  id="resourceDescription"
                  placeholder="Describe the resource provided..."
                  className="min-h-[80px]"
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resourceValue">Value (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-2 top-2.5">R</span>
                    <Input
                      id="resourceValue"
                      type="number"
                      placeholder="0.00"
                      className="pl-6"
                      value={newResource.value}
                      onChange={(e) => setNewResource({...newResource, value: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="resourceDate">Date</Label>
                  <Input
                    id="resourceDate"
                    type="date"
                    value={newResource.date}
                    onChange={(e) => setNewResource({...newResource, date: e.target.value})}
                  />
                </div>
              </div>
              
              <Button onClick={addResourceRecord} className="w-full mt-2">
                <Plus className="mr-2 h-4 w-4" /> Add Resource Record
              </Button>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Resource History</h3>
              {member.resourcesProvided && member.resourcesProvided.length > 0 ? (
                <ScrollArea className="h-[250px]">
                  <div className="space-y-3">
                    {[...member.resourcesProvided]
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((resource) => (
                        <div key={resource.id} className="p-3 border rounded-md">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{formatDate(resource.date)}</span>
                            {resource.value && (
                              <div className="flex items-center text-sm font-semibold">
                                <span>R {resource.value.toFixed(2)}</span>
                              </div>
                            )}
                          </div>
                          <p className="whitespace-pre-line">{resource.description}</p>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-6 border rounded-md">
                  <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <h3 className="font-medium">No Resource Records</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Record resources, support, or services provided to this member.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MemberNotes;

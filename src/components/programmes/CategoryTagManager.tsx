import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProgrammeCategory, ProgrammeTag, Programme } from '@/types';
import { PlusCircle, Tag, Folder, X } from 'lucide-react';

interface CategoryTagManagerProps {
  programmes: Programme[];
  categories: ProgrammeCategory[];
  tags: ProgrammeTag[];
  programmeTags: {programmeId: string, tagId: string}[];
  onAddCategory: (category: Omit<ProgrammeCategory, 'id'>) => ProgrammeCategory | null;
  onAddTag: (tag: Omit<ProgrammeTag, 'id'>) => ProgrammeTag | null;
  onAssignTag: (programmeId: string, tagId: string) => boolean;
  onRemoveTag: (programmeId: string, tagId: string) => boolean;
}

export const CategoryTagManager = ({ 
  programmes, 
  categories,
  tags,
  programmeTags,
  onAddCategory,
  onAddTag,
  onAssignTag,
  onRemoveTag
}: CategoryTagManagerProps) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6'
  });
  
  const [tagForm, setTagForm] = useState({
    name: '',
    color: '#10B981'
  });
  
  const [assignForm, setAssignForm] = useState({
    programmeId: '',
    tagId: ''
  });
  
  const handleAddCategory = () => {
    onAddCategory(categoryForm);
    setIsCategoryDialogOpen(false);
    setCategoryForm({ name: '', description: '', color: '#3B82F6' });
  };
  
  const handleAddTag = () => {
    onAddTag(tagForm);
    setIsTagDialogOpen(false);
    setTagForm({ name: '', color: '#10B981' });
  };
  
  const handleAssignTag = () => {
    if (assignForm.programmeId && assignForm.tagId) {
      onAssignTag(assignForm.programmeId, assignForm.tagId);
      setIsAssignDialogOpen(false);
      setAssignForm({ programmeId: '', tagId: '' });
    }
  };
  
  const getProgrammeTags = (programmeId: string) => {
    const tagIds = programmeTags
      .filter(pt => pt.programmeId === programmeId)
      .map(pt => pt.tagId);
    
    return tags.filter(tag => tagIds.includes(tag.id));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Categories & Tags</h2>
          <p className="text-muted-foreground">
            Organize and categorize your programmes.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={() => setIsCategoryDialogOpen(true)} variant="outline">
            <Folder className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button onClick={() => setIsTagDialogOpen(true)} variant="outline">
            <Tag className="mr-2 h-4 w-4" /> Add Tag
          </Button>
          <Button onClick={() => setIsAssignDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Assign Tag
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No categories defined yet.</p>
                <Button onClick={() => setIsCategoryDialogOpen(true)}>
                  Add Your First Category
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        {category.description && (
                          <div className="text-sm text-muted-foreground">{category.description}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No tags defined yet.</p>
                <Button onClick={() => setIsTagDialogOpen(true)}>
                  Add Your First Tag
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag.id}
                    style={{ 
                      backgroundColor: `${tag.color}20`, 
                      color: tag.color,
                      borderColor: tag.color
                    }}
                    variant="outline"
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Programme Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {programmes.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No programmes available.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {programmes.map(programme => {
                const programmeTags = getProgrammeTags(programme.id);
                
                return (
                  <div key={programme.id} className="border rounded-lg p-4">
                    <div className="font-medium mb-2">{programme.name}</div>
                    <div className="flex flex-wrap gap-2">
                      {programmeTags.length > 0 ? (
                        programmeTags.map(tag => (
                          <Badge 
                            key={tag.id}
                            style={{ 
                              backgroundColor: `${tag.color}20`, 
                              color: tag.color,
                              borderColor: tag.color 
                            }}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {tag.name}
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => onRemoveTag(programme.id, tag.id)}
                            />
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No tags assigned</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Create a new category for organizing programmes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="categoryName">Name</Label>
              <Input 
                id="categoryName"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="categoryDescription">Description (optional)</Label>
              <Input 
                id="categoryDescription"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description"
              />
            </div>
            
            <div>
              <Label htmlFor="categoryColor">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="categoryColor"
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <div
                  className="w-10 h-10 rounded-md"
                  style={{ backgroundColor: categoryForm.color }}
                ></div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddCategory}
              disabled={!categoryForm.name}
            >
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
            <DialogDescription>
              Create a new tag for labeling programmes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="tagName">Name</Label>
              <Input 
                id="tagName"
                value={tagForm.name}
                onChange={(e) => setTagForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter tag name"
              />
            </div>
            
            <div>
              <Label htmlFor="tagColor">Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="tagColor"
                  type="color"
                  value={tagForm.color}
                  onChange={(e) => setTagForm(prev => ({ ...prev, color: e.target.value }))}
                  className="w-16 h-10 p-1"
                />
                <div
                  className="w-10 h-10 rounded-md"
                  style={{ backgroundColor: tagForm.color }}
                ></div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTagDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTag}
              disabled={!tagForm.name}
            >
              Add Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Tag</DialogTitle>
            <DialogDescription>
              Assign a tag to a programme.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="programmeName">Programme</Label>
              <Select 
                value={assignForm.programmeId} 
                onValueChange={(value) => setAssignForm(prev => ({ ...prev, programmeId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select programme" />
                </SelectTrigger>
                <SelectContent>
                  {programmes.map(programme => (
                    <SelectItem key={programme.id} value={programme.id}>
                      {programme.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tagName">Tag</Label>
              <Select 
                value={assignForm.tagId} 
                onValueChange={(value) => setAssignForm(prev => ({ ...prev, tagId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tag" />
                </SelectTrigger>
                <SelectContent>
                  {tags.map(tag => (
                    <SelectItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAssignTag}
              disabled={!assignForm.programmeId || !assignForm.tagId}
            >
              Assign Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

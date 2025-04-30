
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { Folder } from '@/types';
import { toast } from '@/lib/toast';

interface CreateFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolder: string | null;
}

const CreateFolderDialog = ({ open, onOpenChange, currentFolder }: CreateFolderDialogProps) => {
  const { addFolder, folders, currentUser } = useAppContext();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState<string | null>(currentFolder);
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast.error('Please enter a folder name');
      return;
    }
    
    addFolder({
      name: name.trim(),
      parentId,
      createdById: currentUser?.id || 'default-user-1' // Add createdById field using current user or default
    });
    
    // Reset the form
    setName('');
    
    // Close the dialog
    onOpenChange(false);
  };
  
  // When the dialog opens, set the parentId to the currentFolder
  useEffect(() => {
    if (open) {
      setParentId(currentFolder);
    }
  }, [open, currentFolder]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Folder</DialogTitle>
          <DialogDescription>
            Create a new folder to organize your documents.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Folder Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="parent">Parent Folder</Label>
            <Select
              value={parentId || "root"}
              onValueChange={(value) => setParentId(value === "root" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a parent folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}
                    disabled={folder.id === currentFolder} // Can't make a folder its own parent
                  >
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;

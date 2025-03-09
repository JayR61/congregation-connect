
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { Document, Folder } from '@/types';

interface MoveDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const MoveDocumentDialog = ({ open, onOpenChange, document }: MoveDocumentDialogProps) => {
  const { folders, moveDocument } = useAppContext();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  useEffect(() => {
    if (open && document) {
      setSelectedFolderId(document.folderId);
    }
  }, [open, document]);
  
  if (!document) return null;
  
  const handleSubmit = () => {
    moveDocument(document.id, selectedFolderId);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Move Document</DialogTitle>
          <DialogDescription>
            Select a destination folder for "{document.name}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Select
            value={selectedFolderId || "root"}
            onValueChange={(value) => setSelectedFolderId(value === "root" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a destination folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Root</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Move</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveDocumentDialog;

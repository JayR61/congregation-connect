import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/context/AppContext';
import { Document } from '@/types';
import { Upload, X } from 'lucide-react';
import { toast } from '@/lib/toast';

interface NewVersionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
}

const NewVersionDialog = ({ open, onOpenChange, document }: NewVersionDialogProps) => {
  const { addDocumentVersion } = useAppContext();
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSubmit = async () => {
    if (!document) return;
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // In a real application, this would upload to a cloud storage
      // For now, we'll fake it with a local URL
      const fileUrl = URL.createObjectURL(file);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addDocumentVersion(document.id, fileUrl, notes || 'Updated version');
      
      // Reset form
      setNotes('');
      setFile(null);
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading new version:', error);
      toast.error('Failed to upload new version');
    } finally {
      setIsUploading(false);
    }
  };
  
  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setNotes('');
      setFile(null);
    }
  }, [open]);
  
  if (!document) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload New Version</DialogTitle>
          <DialogDescription>
            Upload a new version of "{document.name}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {file ? (
            <div className="flex items-center p-2 border rounded-md">
              <div className="flex-1 truncate">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="font-medium">Click to select a file</p>
              <p className="text-sm text-muted-foreground">
                or drag and drop here
              </p>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Version Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the changes in this version"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload Version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewVersionDialog;

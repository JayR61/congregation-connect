
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, X } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Folder } from '@/types';
import { toast } from '@/lib/toast';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolder: string | null;
}

const UploadDocumentDialog = ({ open, onOpenChange, currentFolder }: UploadDocumentDialogProps) => {
  const { addDocument, folders } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<string | null>(currentFolder);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // If no name is set, use the file name (without extension)
      if (!name) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        setName(fileName);
      }
    }
  };
  
  const detectFileType = (file: File): string => {
    const types: Record<string, string> = {
      'application/pdf': 'pdf',
      'application/msword': 'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.ms-excel': 'xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
      'application/vnd.ms-powerpoint': 'ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
      'text/plain': 'txt',
      'text/html': 'html',
      'text/css': 'css',
      'text/javascript': 'js',
      'application/json': 'json',
    };
    
    // Check if it's an image
    if (file.type.startsWith('image/')) {
      return 'image';
    }
    
    // Check if it's a video
    if (file.type.startsWith('video/')) {
      return 'video';
    }
    
    // Check if it's an audio
    if (file.type.startsWith('audio/')) {
      return 'audio';
    }
    
    // Return the specific type or the mime type if not in our list
    return types[file.type] || file.type;
  };
  
  const handleSubmit = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!name) {
      toast.error('Please enter a document name');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // In a real application, this would upload to a cloud storage service
      // For now, we'll fake it with a local URL
      const fileUrl = URL.createObjectURL(file);
      const fileType = detectFileType(file);
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addDocument({
        name,
        description,
        folderId,
        fileType,
        fileSize: file.size,
        url: fileUrl,
        thumbnailUrl: fileType === 'image' ? fileUrl : null,
        shared: false
      }, file);
      
      // Reset the form
      setName('');
      setDescription('');
      setFile(null);
      
      // Close the dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };
  
  const resetForm = () => {
    setName('');
    setDescription('');
    setFile(null);
    setFolderId(currentFolder);
  };
  
  // When the dialog closes, reset the form
  React.useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open, currentFolder]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your church management system.
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
            <Label htmlFor="name">Document Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="folder">Folder</Label>
            <Select
              value={folderId || "root"}
              onValueChange={(value) => setFolderId(value === "root" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a folder" />
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
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;

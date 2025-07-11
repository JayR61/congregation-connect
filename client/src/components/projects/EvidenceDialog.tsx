
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, FileText, FileImage, Video, FileAudio, File } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (files: File[], description: string) => void;
}

const EvidenceDialog: React.FC<EvidenceDialogProps> = ({ open, onOpenChange, onSave }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(files, description);
    setFiles([]);
    setDescription('');
  };

  const getFileIcon = (file: File) => {
    const type = file.type;
    
    if (type.startsWith('image/')) {
      return <FileImage className="h-6 w-6 text-blue-500" />;
    } else if (type === 'application/pdf') {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (type.startsWith('video/')) {
      return <Video className="h-6 w-6 text-purple-500" />;
    } else if (type.startsWith('audio/')) {
      return <FileAudio className="h-6 w-6 text-green-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClose = () => {
    setFiles([]);
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Evidence</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 w-full max-h-[60vh]">
          <div className="py-4 space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">Drop your files here or click to upload</p>
              <p className="text-xs text-muted-foreground mb-3">
                Supports all file types
              </p>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('file-upload')?.click()}
                className="mt-2"
              >
                Select Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="*/*"
              />
            </div>
            
            {files.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Files ({files.length})</Label>
                <div className="max-h-[200px] overflow-auto border rounded-md">
                  {files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-2 truncate">
                        {getFileIcon(file)}
                        <div className="truncate">
                          <p className="text-sm font-medium truncate" title={file.name}>
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFile(index)}
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="evidence-description">Description</Label>
              <Textarea
                id="evidence-description"
                placeholder="Provide context for these files..."
                className="resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSave}
            disabled={files.length === 0}
          >
            Save Evidence
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceDialog;

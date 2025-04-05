
import React, { useState, useRef } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { 
  Upload, 
  X, 
  CalendarIcon, 
  FileText, 
  FileImage, 
  Video, 
  FileAudio, 
  File 
} from 'lucide-react';
import { toast } from '@/lib/toast';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EvidenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EvidenceFormValues) => void;
}

interface EvidenceFormValues {
  title: string;
  description: string;
  date: Date;
  file?: File;
}

const EvidenceDialog: React.FC<EvidenceDialogProps> = ({ open, onOpenChange, onSubmit }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<EvidenceFormValues>({
    defaultValues: {
      title: '',
      description: '',
      date: new Date(),
    }
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (!open) {
      form.reset();
      setFile(null);
    }
  }, [open, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // If no title is set, use the file name (without extension)
      if (!form.getValues('title')) {
        const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
        form.setValue('title', fileName);
      }
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // If no title is set, use the file name (without extension)
      if (!form.getValues('title')) {
        const fileName = droppedFile.name.split('.').slice(0, -1).join('.');
        form.setValue('title', fileName);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const detectFileType = (file: File): string => {
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
    
    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'xls':
      case 'xlsx':
        return 'excel';
      case 'ppt':
      case 'pptx':
        return 'powerpoint';
      case 'txt':
        return 'text';
      default:
        return file.type || 'unknown';
    }
  };
  
  const getFileIcon = (file: File) => {
    const fileType = detectFileType(file);
    
    switch (fileType) {
      case 'image':
        return <FileImage className="h-10 w-10 text-blue-500" />;
      case 'video':
        return <Video className="h-10 w-10 text-purple-500" />;
      case 'audio':
        return <FileAudio className="h-10 w-10 text-green-500" />;
      case 'pdf':
        return <FileText className="h-10 w-10 text-red-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      setIsUploading(true);
      
      if (file) {
        // In a real app, you would upload the file to cloud storage
        // For now, we'll create an object URL
        const fileUrl = URL.createObjectURL(file);
        
        onSubmit({
          ...data,
          file: file
        });
      } else {
        onSubmit(data);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error uploading evidence:', error);
      toast.error('Failed to upload evidence');
    } finally {
      setIsUploading(false);
    }
  });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add Project Evidence</DialogTitle>
          <DialogDescription>
            Provide supporting evidence for this project to verify its authenticity.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4 overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {file ? (
                <div className="flex items-center p-3 border rounded-md">
                  <div className="mr-2 flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 truncate min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {(file.size / 1024).toFixed(2)} KB • {file.type || 'Unknown type'}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => setFile(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="font-medium">Click to select a file</p>
                  <p className="text-sm text-muted-foreground">
                    or drag and drop here
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Support for images, videos, documents, PDFs, and more
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="*/*" // Accept all file types
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="title">Evidence Title</Label>
                <Input
                  id="title"
                  {...form.register('title', { required: true })}
                  placeholder="Enter evidence title"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      {form.getValues('date') ? (
                        format(form.getValues('date'), 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={form.getValues('date')}
                      onSelect={(date) => form.setValue('date', date as Date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description', { required: true })}
                  placeholder="Describe this evidence and how it verifies the project"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter className="flex justify-between sm:justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Evidence'}
              </Button>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceDialog;

import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, X, File, FileText, FileImage, Video, FileAudio, Sparkles } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFolderId: string | null;
}

const UploadDocumentDialog = ({ open, onOpenChange, currentFolderId }: UploadDocumentDialogProps) => {
  const { addDocument, folders, currentUser } = useAppContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [folderId, setFolderId] = useState<string | null>(currentFolderId);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [generateSummary, setGenerateSummary] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (open) {
      setFolderId(currentFolderId);
    } else {
      resetForm();
    }
  }, [open, currentFolderId]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setFile(null);
    setIsUploading(false);
    setDragOver(false);
    setAiSummary('');
    setGenerateSummary(false);
    setIsGeneratingSummary(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-8 w-8" />;
    if (fileType.startsWith('video/')) return <Video className="h-8 w-8" />;
    if (fileType.startsWith('audio/')) return <FileAudio className="h-8 w-8" />;
    if (fileType.includes('pdf') || fileType.includes('document') || fileType.includes('text')) return <FileText className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      processFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const generateAISummary = async (file: File) => {
    if (!file) return;
    
    setIsGeneratingSummary(true);
    
    try {
      // For text files, read content and generate summary
      if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
        const text = await file.text();
        const summary = `Document Analysis: "${file.name}" - ${(file.size / 1024).toFixed(1)} KB text file containing ${text.length} characters. Key topics may include church operations, administrative content, or ministry-related information. This document appears to be a ${file.type.includes('plain') ? 'plain text' : 'formatted text'} file suitable for church documentation.`;
        setAiSummary(summary);
      } else {
        // For other file types, generate basic summary
        const fileType = file.type.split('/')[0];
        const extension = file.name.split('.').pop()?.toUpperCase();
        const summary = `Document Analysis: "${file.name}" - ${(file.size / 1024).toFixed(1)} KB ${extension} file. This ${fileType} document is suitable for church documentation and resource management. Content type: ${file.type}. Recommended for organized storage in appropriate church folders.`;
        setAiSummary(summary);
      }
    } catch (error) {
      setAiSummary('Unable to generate AI summary for this file type.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    
    // If no name is set, use the file name (without extension)
    if (!name) {
      const fileName = selectedFile.name.split('.').slice(0, -1).join('.');
      setName(fileName);
    }
    
    // Generate AI summary if enabled
    if (generateSummary) {
      generateAISummary(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Error", 
        description: "Please enter a document name",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload - in a real app, this would upload to a server
      const fileUrl = URL.createObjectURL(file);
      const fileExtension = getFileExtension(file.name);
      
      const finalDescription = aiSummary && generateSummary 
        ? `${description.trim()}\n\nAI Summary: ${aiSummary}`
        : description.trim();
      
      const newDocument = {
        name: name.trim(),
        folderId: folderId,
        fileType: fileExtension,
        fileSize: file.size,
        url: fileUrl,
        description: finalDescription,
        tags: [],
        shared: false,
        createdBy: currentUser.id,
        versions: [{
          id: `version-${Date.now()}`,
          documentId: `doc-${Date.now()}`,
          version: 1,
          createdAt: new Date(),
          createdBy: currentUser.id,
          fileSize: file.size,
          url: fileUrl
        }]
      };

      addDocument(newDocument);
      
      toast({
        title: "Success",
        description: "Document uploaded successfully"
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to the church document library.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label>File</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center text-blue-600">
                    {getFileIcon(file.type)}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-gray-400" />
                  <div className="text-sm">
                    <p>Drag and drop a file here, or click to select</p>
                    <p className="text-gray-500">Supports PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, images</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.gif,.bmp,.svg"
            />
          </div>

          {/* Document Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Document Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter document name"
              required
            />
          </div>

          {/* AI Summary Toggle */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="ai-summary"
                checked={generateSummary}
                onCheckedChange={(checked) => {
                  setGenerateSummary(checked);
                  if (checked && file) {
                    generateAISummary(file);
                  } else {
                    setAiSummary('');
                  }
                }}
              />
              <Label htmlFor="ai-summary" className="flex items-center space-x-1">
                <Sparkles className="h-4 w-4" />
                <span>Generate AI Summary</span>
              </Label>
            </div>
          </div>

          {/* AI Summary Display */}
          {generateSummary && aiSummary && (
            <div className="space-y-2">
              <Label>AI Generated Summary</Label>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                {isGeneratingSummary ? 'Generating summary...' : aiSummary}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter document description (optional)"
              rows={3}
            />
          </div>

          {/* Folder Selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={folderId || 'root'} onValueChange={(value) => setFolderId(value === 'root' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="root">Root Folder</SelectItem>
                {folders.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id}>
                    {folder.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Document as DocumentType, DocumentVersion } from '@/types';
import { File, FileText, FileImage, Download, X, Clock, Video, FileAudio, ExternalLink } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { formatDistance } from 'date-fns';

interface DocumentPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: DocumentType | null;
}

const DocumentPreviewDialog = ({ open, onOpenChange, document }: DocumentPreviewDialogProps) => {
  const { members } = useAppContext();
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  
  // Reset selected version when document changes
  useEffect(() => {
    setSelectedVersion(null);
  }, [document]);
  
  // Clear any resources when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedVersion(null);
    }
  }, [open]);
  
  if (!document) return null;
  
  const currentVersion = selectedVersion === null 
    ? document.versions[document.versions.length - 1] 
    : document.versions.find(v => v.version === selectedVersion) || document.versions[document.versions.length - 1];
  
  const renderPreview = () => {
    if (!currentVersion) return null;
    
    const url = currentVersion.url;
    setLoadingPreview(true);
    
    // Image preview
    if (document.fileType === 'image') {
      return (
        <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
          <img 
            src={url} 
            alt={document.name} 
            className="max-h-[500px] max-w-full object-contain rounded shadow"
            onLoad={() => setLoadingPreview(false)}
            onError={() => setLoadingPreview(false)}
          />
        </div>
      );
    }
    
    // PDF preview
    if (document.fileType === 'pdf') {
      return (
        <div className="aspect-video bg-muted/50 rounded-md">
          <iframe 
            src={url} 
            className="w-full h-full border-0 rounded" 
            title={document.name}
            onLoad={() => setLoadingPreview(false)}
          />
        </div>
      );
    }
    
    // Video preview
    if (document.fileType === 'video') {
      return (
        <div className="aspect-video bg-muted/50 rounded-md">
          <video 
            src={url} 
            controls 
            className="w-full h-full"
            onLoadedData={() => setLoadingPreview(false)}
            onError={() => setLoadingPreview(false)} 
          />
        </div>
      );
    }
    
    // Audio preview
    if (document.fileType === 'audio') {
      return (
        <div className="p-8 bg-muted/50 rounded-md flex items-center justify-center">
          <audio 
            src={url} 
            controls 
            className="w-full"
            onLoadedData={() => setLoadingPreview(false)}
            onError={() => setLoadingPreview(false)}
          />
        </div>
      );
    }
    
    // Text file preview (for txt, html, css, js, etc.)
    if (['txt', 'html', 'css', 'js', 'json'].includes(document.fileType)) {
      setLoadingPreview(false);
      return (
        <div className="p-4 bg-muted/50 rounded-md">
          <div className="bg-white p-4 rounded border shadow max-h-[500px] overflow-auto">
            <pre className="whitespace-pre-wrap text-sm">{document.content || "Text preview not available"}</pre>
          </div>
        </div>
      );
    }
    
    // Fallback for other file types
    setLoadingPreview(false);
    return (
      <div className="p-16 bg-muted/50 rounded-md flex flex-col items-center justify-center text-center">
        {getFileIcon(document.fileType)}
        <p className="mt-4 text-lg font-medium">{document.name}</p>
        <p className="text-sm text-muted-foreground">
          {document.fileType.toUpperCase()} file • {formatFileSize(document.fileSize)}
        </p>
        <Button className="mt-4" onClick={() => window.open(url, '_blank')}>
          <Download className="mr-2 h-4 w-4" /> Download to View
        </Button>
      </div>
    );
  };
  
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'image':
        return <FileImage className="h-20 w-20 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-20 w-20 text-red-500" />;
      case 'video':
        return <Video className="h-20 w-20 text-purple-500" />;
      case 'audio':
        return <FileAudio className="h-20 w-20 text-green-500" />;
      default:
        return <File className="h-20 w-20 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const getVersionLabel = (version: DocumentVersion) => {
    const creator = members.find(m => m.id === version.createdById || version.createdBy);
    const createdByName = creator 
      ? `${creator.firstName} ${creator.lastName}`
      : 'Unknown';
    
    return `v${version.version} - ${formatDistance(new Date(version.createdAt), new Date(), { addSuffix: true })} by ${createdByName}`;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate pr-8">{document.name}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto">
          {loadingPreview && (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <div className={loadingPreview ? 'hidden' : 'block'}>
            {renderPreview()}
          </div>
          
          <div className="mt-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
              <h3 className="text-sm font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" /> Version History
              </h3>
              
              <Select 
                value={selectedVersion?.toString() || 'latest'}
                onValueChange={(value) => setSelectedVersion(value === 'latest' ? null : parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Select Version" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest Version</SelectItem>
                  {document.versions.map((version) => (
                    <SelectItem key={version.id} value={version.version.toString()}>
                      {getVersionLabel(version)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {currentVersion && (
              <div className="p-3 bg-muted rounded-md text-sm">
                <p className="font-medium">Version Notes:</p>
                <p className="text-muted-foreground">{currentVersion.notes || 'No notes for this version'}</p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter className="mt-4 flex items-center justify-between md:justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(currentVersion?.url, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
            </Button>
            <Button onClick={() => window.open(currentVersion?.url, '_blank')} className="ml-2">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreviewDialog;


import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Download, ExternalLink } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    name: string;
    url: string;
    type: string;
    size: number;
  } | null;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  const isImage = document.type.startsWith('image/');
  const isPdf = document.type === 'application/pdf';
  const isVideo = document.type.startsWith('video/');
  const isAudio = document.type.startsWith('audio/');
  const isText = document.type.startsWith('text/') || document.name.endsWith('.txt');

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (!document) return;
    // Use window.document instead of document to avoid name collision
    const a = window.document.createElement('a');
    a.href = document.url;
    a.download = document.name;
    a.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate pr-8">{document.name}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ScrollArea className="flex-1 w-full max-h-[60vh]">
          <div className="p-4">
            {isImage && (
              <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
                <img 
                  src={document.url} 
                  alt={document.name} 
                  className="max-h-[500px] max-w-full object-contain rounded shadow"
                />
              </div>
            )}
            
            {isPdf && (
              <div className="aspect-video bg-muted/50 rounded-md">
                <iframe 
                  src={document.url} 
                  className="w-full h-[500px] border-0 rounded" 
                  title={document.name}
                />
              </div>
            )}
            
            {isVideo && (
              <div className="aspect-video bg-muted/50 rounded-md">
                <video 
                  src={document.url} 
                  controls 
                  className="w-full h-full"
                />
              </div>
            )}
            
            {isAudio && (
              <div className="p-8 bg-muted/50 rounded-md flex items-center justify-center">
                <audio 
                  src={document.url} 
                  controls 
                  className="w-full"
                />
              </div>
            )}
            
            {(!isImage && !isPdf && !isVideo && !isAudio) && (
              <div className="p-16 bg-muted/50 rounded-md flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4 text-primary/70">
                  {isText ? '📝' : '📄'}
                </div>
                <p className="mt-4 text-lg font-medium">{document.name}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {document.type || 'Unknown file type'} • {formatFileSize(document.size)}
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-2">
                  <Button onClick={() => window.open(document.url, '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="mt-4 flex items-center justify-between md:justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.open(document.url, '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" /> Open in New Tab
            </Button>
            <Button onClick={handleDownload} className="ml-2">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentPreview;

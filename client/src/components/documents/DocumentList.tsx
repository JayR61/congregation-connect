
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Download, Share, MoreVertical, ExternalLink, 
  History, ChevronRight, Trash, FileText, 
  FileImage, Video, FileAudio, File
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Document } from '@/types';
import { formatDistance } from 'date-fns';

interface DocumentListProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  onDownload: (document: Document) => void;
  onShare: (document: Document) => void;
  onNewVersion: (document: Document) => void;
  onMove: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentList = ({
  documents,
  onPreview,
  onDownload,
  onShare,
  onNewVersion,
  onMove,
  onDelete
}: DocumentListProps) => {
  
  const getIconForFileType = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
      case 'application/pdf': return <FileText className="h-10 w-10 text-red-500" />;
      case 'image':
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif': return <FileImage className="h-10 w-10 text-blue-500" />;
      case 'video':
      case 'video/mp4':
      case 'video/webm': return <Video className="h-10 w-10 text-purple-500" />;
      case 'audio':
      case 'audio/mp3':
      case 'audio/wav': return <FileAudio className="h-10 w-10 text-green-500" />;
      case 'doc':
      case 'docx':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': return <FileText className="h-10 w-10 text-blue-700" />;
      default: return <File className="h-10 w-10 text-gray-500" />;
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  const formatDate = (dateString: Date) => {
    return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
  };
  
  return (
    <div className="border rounded-md divide-y">
      {documents.map((document) => (
        <div key={document.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
          <div 
            className="flex items-center space-x-4 cursor-pointer flex-1"
            onClick={() => onPreview(document)}
          >
            {document.thumbnailUrl ? (
              <div className="w-12 h-12 overflow-hidden rounded border flex-shrink-0">
                <img 
                  src={document.thumbnailUrl} 
                  alt={document.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0">
                {getIconForFileType(document.fileType)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{document.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <span>{formatFileSize(document.fileSize)}</span>
                <span>•</span>
                <span>Modified {formatDate(document.updatedAt)}</span>
                {document.shared && (
                  <>
                    <span>•</span>
                    <span className="inline-flex items-center text-blue-600">
                      <Share className="h-3 w-3 mr-1" /> Shared
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost" onClick={() => onDownload(document)}>
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onShare(document)}>
              <Share className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onPreview(document)}>
                  <ExternalLink className="mr-2 h-4 w-4" /> Preview
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNewVersion(document)}>
                  <History className="mr-2 h-4 w-4" /> Upload New Version
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onMove(document)}>
                  <ChevronRight className="mr-2 h-4 w-4" /> Move
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500" onClick={() => onDelete(document.id)}>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;

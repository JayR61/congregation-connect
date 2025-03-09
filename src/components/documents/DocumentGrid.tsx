
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
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

interface DocumentGridProps {
  documents: Document[];
  onPreview: (document: Document) => void;
  onDownload: (document: Document) => void;
  onShare: (document: Document) => void;
  onNewVersion: (document: Document) => void;
  onMove: (document: Document) => void;
  onDelete: (id: string) => void;
}

const DocumentGrid = ({
  documents,
  onPreview,
  onDownload,
  onShare,
  onNewVersion,
  onMove,
  onDelete
}: DocumentGridProps) => {
  
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {documents.map((document) => (
        <Card key={document.id} className="overflow-hidden group hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div 
              className="flex flex-col items-center text-center cursor-pointer"
              onClick={() => onPreview(document)}
            >
              {document.thumbnailUrl ? (
                <div className="w-24 h-24 mb-2 overflow-hidden rounded border">
                  <img 
                    src={document.thumbnailUrl} 
                    alt={document.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
              ) : (
                getIconForFileType(document.fileType)
              )}
              <h3 className="font-medium mt-2 truncate w-full">{document.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(document.fileSize)} • {formatDate(document.updatedAt)}
              </p>
              {document.shared && (
                <div className="mt-1">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Share className="h-3 w-3 mr-1" /> Shared
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center space-x-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => onDownload(document)}>
                <Download className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => onShare(document)}>
                <Share className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentGrid;

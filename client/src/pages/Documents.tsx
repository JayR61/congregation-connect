import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Plus, Upload, FolderPlus, Grid, List, 
  File, FileText, FileImage, FileSpreadsheet, 
  Download, Share, Eye, MoreHorizontal, Folder,
  Clock, User, Tag, Filter
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAppContext } from '@/context/AppContext';
import { Document, Folder as FolderType } from '@/types';
import { formatDistance } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import CreateFolderDialog from '@/components/documents/CreateFolderDialog';
import DocumentPreviewDialog from '@/components/documents/DocumentPreviewDialog';
import ShareDocumentDialog from '@/components/documents/ShareDocumentDialog';

const Documents = () => {
  const { documents, folders, moveDocument, deleteDocument, shareDocument } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [draggedDocument, setDraggedDocument] = useState<Document | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  // Get all unique tags from documents
  const allTags = Array.from(new Set(documents.flatMap(doc => doc.tags || [])));

  // Filter documents based on search, folder, and tags
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFolder = selectedFolder === null || doc.folderId === selectedFolder;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => doc.tags?.includes(tag));
    
    return matchesSearch && matchesFolder && matchesTags;
  });

  // Get folder structure for navigation
  const rootFolders = folders.filter(folder => folder.parentId === null);
  const getSubfolders = (parentId: string) => 
    folders.filter(folder => folder.parentId === parentId);

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return <FileText className="h-8 w-8 text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="h-8 w-8 text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="h-8 w-8 text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-8 w-8 text-purple-500" />;
      default:
        return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleDocumentDragStart = (e: React.DragEvent, document: Document) => {
    setDraggedDocument(document);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', document.id);
  };

  const handleDocumentDragEnd = () => {
    setDraggedDocument(null);
    setDragOverFolder(null);
  };

  const handleFolderDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverFolder(folderId);
  };

  const handleFolderDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleFolderDrop = (e: React.DragEvent, targetFolderId: string | null) => {
    e.preventDefault();
    setDragOverFolder(null);
    
    if (draggedDocument && draggedDocument.folderId !== targetFolderId) {
      const success = moveDocument(draggedDocument.id, targetFolderId);
      if (success) {
        toast({
          title: "Document moved",
          description: `"${draggedDocument.name}" moved to ${targetFolderId ? folders.find(f => f.id === targetFolderId)?.name : 'Root'} folder`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to move document",
          variant: "destructive"
        });
      }
    }
    setDraggedDocument(null);
  };

  // Document action handlers
  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowPreviewDialog(true);
  };

  const handleDownloadDocument = (document: Document) => {
    if (document.url) {
      // Create a download link
      const link = document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading "${document.name}"`
      });
    } else {
      toast({
        title: "Error",
        description: "Download link not available",
        variant: "destructive"
      });
    }
  };

  const handleShareDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowShareDialog(true);
  };

  const handleDeleteDocument = (documentId: string) => {
    const document = documents.find(d => d.id === documentId);
    if (document) {
      if (window.confirm(`Are you sure you want to delete "${document.name}"? This action cannot be undone.`)) {
        deleteDocument(documentId);
        toast({
          title: "Document deleted",
          description: `"${document.name}" has been deleted successfully`
        });
      }
    }
  };

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card 
      className={cn(
        "card-hover group cursor-move transition-all duration-200",
        draggedDocument?.id === document.id && "opacity-50 scale-95"
      )}
      draggable
      onDragStart={(e) => handleDocumentDragStart(e, document)}
      onDragEnd={handleDocumentDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getFileIcon(document.fileType)}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{document.name}</h3>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShareDocument(document)}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleDeleteDocument(document.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {document.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {document.description}
          </p>
        )}
        
        <div className="space-y-2">
          {document.tags && document.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {document.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{document.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDistance(document.updatedAt, new Date(), { addSuffix: true })}</span>
            </div>
            {document.shared && (
              <Badge variant="outline" className="text-xs">
                Shared
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const FolderCard = ({ folder }: { folder: FolderType }) => {
    const documentsInFolder = documents.filter(doc => doc.folderId === folder.id).length;
    const subfolders = getSubfolders(folder.id);
    
    return (
      <Card 
        className={cn(
          "card-hover cursor-pointer group transition-all duration-200",
          dragOverFolder === folder.id && "border-blue-500 bg-blue-50 scale-105"
        )}
        onClick={() => setSelectedFolder(folder.id)}
        onDragOver={(e) => handleFolderDragOver(e, folder.id)}
        onDragLeave={handleFolderDragLeave}
        onDrop={(e) => handleFolderDrop(e, folder.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Folder className={cn(
              "h-8 w-8 transition-colors",
              dragOverFolder === folder.id ? "text-blue-600" : "text-blue-500"
            )} />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{folder.name}</h3>
              <p className="text-xs text-muted-foreground">
                {documentsInFolder} document{documentsInFolder !== 1 ? 's' : ''}
                {subfolders.length > 0 && `, ${subfolders.length} subfolder${subfolders.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          {dragOverFolder === folder.id && (
            <div className="text-xs text-blue-600 font-medium">
              Drop document here
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-enter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-gradient text-3xl font-bold">Documents</h1>
          <p className="text-elegant mt-2">
            Manage and organize your church documents, files, and resources
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowCreateFolderDialog(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Tag Filters */}
          {allTags.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Breadcrumb */}
      {selectedFolder && (
        <div className="flex items-center space-x-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedFolder(null)}
          >
            Root
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="font-medium">
            {folders.find(f => f.id === selectedFolder)?.name}
          </span>
        </div>
      )}

      {/* Root Folder Drop Zone */}
      {draggedDocument && (
        <Card 
          className={cn(
            "border-2 border-dashed transition-all duration-200",
            dragOverFolder === null ? "border-blue-500 bg-blue-50" : "border-gray-300"
          )}
          onDragOver={(e) => handleFolderDragOver(e, null)}
          onDragLeave={handleFolderDragLeave}
          onDrop={(e) => handleFolderDrop(e, null)}
        >
          <CardContent className="p-4 text-center">
            <Folder className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-sm text-muted-foreground">
              Drop here to move to Root folder
            </p>
          </CardContent>
        </Card>
      )}

      {/* Folder View */}
      {selectedFolder === null && (
        <div>
          <h2 className="text-lg font-semibold mb-4">Folders</h2>
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
            {rootFolders.map(folder => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        </div>
      )}

      {/* Documents View */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {selectedFolder ? 'Documents' : 'Recent Documents'}
          </h2>
          <span className="text-sm text-muted-foreground">
            {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredDocuments.map(document => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
        
        {filteredDocuments.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedTags.length > 0 
                  ? "Try adjusting your search or filters"
                  : "Start by uploading your first document"
                }
              </p>
              {!searchTerm && selectedTags.length === 0 && (
                <Button onClick={() => setShowUploadDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      {/* Dialog Components */}
      <UploadDocumentDialog 
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        currentFolderId={selectedFolder}
      />
      <CreateFolderDialog 
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
        currentFolder={selectedFolder}
      />

      <DocumentPreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        document={selectedDocument}
      />

      <ShareDocumentDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
        document={selectedDocument}
      />
    </div>
  );
};

export default Documents;
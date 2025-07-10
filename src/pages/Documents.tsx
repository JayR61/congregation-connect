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

const Documents = () => {
  const { documents, folders } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="card-hover group">
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
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
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
        className="card-hover cursor-pointer group"
        onClick={() => setSelectedFolder(folder.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Folder className="h-8 w-8 text-blue-500" />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{folder.name}</h3>
              <p className="text-xs text-muted-foreground">
                {documentsInFolder} document{documentsInFolder !== 1 ? 's' : ''}
                {subfolders.length > 0 && `, ${subfolders.length} subfolder${subfolders.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
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
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
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
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Documents;
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Filter, Grid3X3, List, File, FileText, 
  FileImage, Folder, Share, Download, MoreVertical, 
  ChevronRight, FolderPlus, UploadCloud, History, 
  ExternalLink, StarIcon, Trash, Video, FileAudio
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useAppContext } from '@/context/AppContext';
import { Document, Folder as FolderType } from '@/types';
import { formatDistance } from 'date-fns';

// Import the dialogs
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import CreateFolderDialog from "@/components/documents/CreateFolderDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import MoveDocumentDialog from "@/components/documents/MoveDocumentDialog";
import NewVersionDialog from "@/components/documents/NewVersionDialog";

const Documents = () => {
  const { documents, folders, deleteDocument, deleteFolder, shareDocument } = useAppContext();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  
  // Filtered data based on current folder and search
  const filteredFolders = folders.filter(folder => {
    const matchesFolder = folder.parentId === currentFolder;
    const matchesSearch = searchQuery ? 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesFolder && matchesSearch;
  });
  
  const filteredDocuments = documents.filter(doc => {
    if (activeTab === 'recent') {
      // Show documents modified in the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(doc.updatedAt) >= sevenDaysAgo;
    } else if (activeTab === 'shared') {
      return doc.shared;
    } else if (activeTab === 'favorites') {
      // This could be implemented with a 'favorite' flag in the future
      return false;
    } else {
      // All documents tab - filter by folder and search
      const matchesFolder = doc.folderId === currentFolder;
      const matchesSearch = searchQuery ? 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchesFolder && matchesSearch;
    }
  });
  
  // Sort folders and documents by name
  const sortedFolders = [...filteredFolders].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const sortedDocuments = [...filteredDocuments].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Handlers
  const handleShareDocument = (document: Document) => {
    shareDocument(document.id, !document.shared);
  };
  
  const handleDownloadDocument = (document: Document) => {
    window.open(document.url, '_blank');
  };
  
  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setPreviewDialogOpen(true);
  };
  
  const handleMoveDocument = (document: Document) => {
    setSelectedDocument(document);
    setMoveDialogOpen(true);
  };
  
  const handleNewVersion = (document: Document) => {
    setSelectedDocument(document);
    setNewVersionDialogOpen(true);
  };
  
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    // When navigating to a folder, always switch to the 'all' tab
    setActiveTab('all');
  };
  
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
  
  const getBreadcrumbs = () => {
    if (currentFolder === null) {
      return (
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">Documents</span>
        </div>
      );
    }
    
    // Build the breadcrumb path
    const breadcrumbs: FolderType[] = [];
    let currentFolderId = currentFolder;
    
    while (currentFolderId) {
      const folder = folders.find(f => f.id === currentFolderId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentFolderId = folder.parentId;
      } else {
        break;
      }
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
        <button 
          className="hover:text-foreground"
          onClick={() => navigateToFolder(null)}
        >
          Documents
        </button>
        
        {breadcrumbs.map((folder, index) => (
          <span key={folder.id} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1" />
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{folder.name}</span>
            ) : (
              <button 
                className="hover:text-foreground"
                onClick={() => navigateToFolder(folder.id)}
              >
                {folder.name}
              </button>
            )}
          </span>
        ))}
      </div>
    );
  };
  
  // Only show folder navigation when in the "All Documents" tab
  const showFolderNav = activeTab === 'all';
  
  // When changing tabs, we may need to adjust what's displayed
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage church documents and files</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setUploadDialogOpen(true)}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
          </Button>
          {showFolderNav && (
            <Button variant="outline" onClick={() => setCreateFolderDialogOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" /> New Folder
            </Button>
          )}
        </div>
      </div>

      {showFolderNav && getBreadcrumbs()}

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <div className="border rounded-md flex">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {showFolderNav && sortedFolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Folders</h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedFolders.map((folder) => (
                    <Card 
                      key={folder.id} 
                      className="cursor-pointer hover:bg-muted/50 transition-colors group"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center" 
                          onClick={() => navigateToFolder(folder.id)}
                        >
                          <Folder className="h-16 w-16 text-amber-500 mb-2 group-hover:scale-105 transition-transform" />
                          <h3 className="font-medium">{folder.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {documents.filter(d => d.folderId === folder.id).length} items
                          </p>
                        </div>
                        <div className="mt-4 pt-4 border-t flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem 
                                onClick={() => navigateToFolder(folder.id)}
                              >
                                <ChevronRight className="mr-2 h-4 w-4" /> Open
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500"
                                onClick={() => deleteFolder(folder.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {sortedFolders.map((folder) => (
                    <div 
                      key={folder.id} 
                      className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4"
                        onClick={() => navigateToFolder(folder.id)}
                      >
                        <Folder className="h-8 w-8 text-amber-500" />
                        <div>
                          <h3 className="font-medium">{folder.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {documents.filter(d => d.folderId === folder.id).length} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" 
                          onClick={() => navigateToFolder(folder.id)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem 
                              onClick={() => navigateToFolder(folder.id)}
                            >
                              <ChevronRight className="mr-2 h-4 w-4" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500"
                              onClick={() => deleteFolder(folder.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Documents */}
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Documents</h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedDocuments.map((document) => (
                    <Card key={document.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div 
                          className="flex flex-col items-center text-center cursor-pointer"
                          onClick={() => handlePreviewDocument(document)}
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
                          <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShareDocument(document)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                                <ExternalLink className="mr-2 h-4 w-4" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                                <History className="mr-2 h-4 w-4" /> Upload New Version
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                                <ChevronRight className="mr-2 h-4 w-4" /> Move
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {sortedDocuments.map((document) => (
                    <div key={document.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div 
                        className="flex items-center space-x-4 cursor-pointer flex-1"
                        onClick={() => handlePreviewDocument(document)}
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
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadDocument(document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShareDocument(document)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                              <History className="mr-2 h-4 w-4" /> Upload New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                              <ChevronRight className="mr-2 h-4 w-4" /> Move
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center py-8">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    {currentFolder === null 
                      ? 'Upload your first document to get started' 
                      : 'This folder is currently empty'}
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Documents</h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedDocuments.map((document) => (
                    <Card key={document.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div 
                          className="flex flex-col items-center text-center cursor-pointer"
                          onClick={() => handlePreviewDocument(document)}
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
                          <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShareDocument(document)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                                <ExternalLink className="mr-2 h-4 w-4" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                                <History className="mr-2 h-4 w-4" /> Upload New Version
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                                <ChevronRight className="mr-2 h-4 w-4" /> Move
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {sortedDocuments.map((document) => (
                    <div key={document.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div 
                        className="flex items-center space-x-4 cursor-pointer flex-1"
                        onClick={() => handlePreviewDocument(document)}
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
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadDocument(document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShareDocument(document)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                              <History className="mr-2 h-4 w-4" /> Upload New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                              <ChevronRight className="mr-2 h-4 w-4" /> Move
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center py-8">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No recent documents</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    Documents modified in the last 7 days will appear here
                  </p>
                  <Button onClick={() => setUploadDialogOpen(true)}>
                    <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="shared">
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Shared Documents</h3>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {sortedDocuments.map((document) => (
                    <Card key={document.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div 
                          className="flex flex-col items-center text-center cursor-pointer"
                          onClick={() => handlePreviewDocument(document)}
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
                          <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document)}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleShareDocument(document)}>
                            <Share className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                                <ExternalLink className="mr-2 h-4 w-4" /> Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                                <History className="mr-2 h-4 w-4" /> Upload New Version
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                                <ChevronRight className="mr-2 h-4 w-4" /> Move
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-md divide-y">
                  {sortedDocuments.map((document) => (
                    <div key={document.id} className="p-4 flex items-center justify-between hover:bg-muted/50">
                      <div 
                        className="flex items-center space-x-4 cursor-pointer flex-1"
                        onClick={() => handlePreviewDocument(document)}
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
                        <Button size="sm" variant="ghost" onClick={() => handleDownloadDocument(document)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleShareDocument(document)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handlePreviewDocument(document)}>
                              <ExternalLink className="mr-2 h-4 w-4" /> Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleNewVersion(document)}>
                              <History className="mr-2 h-4 w-4" /> Upload New Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMoveDocument(document)}>
                              <ChevronRight className="mr-2 h-4 w-4" /> Move
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => deleteDocument(document.id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex flex-col items-center py-8">
                  <Share className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No shared documents</h3>
                  <p className="text-muted-foreground mt-2 mb-6">
                    Share documents with others to see them here
                  </p>
                  <Button onClick={() => navigateToFolder(null)}>
                    Go to All Documents
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex flex-col items-center py-8">
                <StarIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Favorites Coming Soon</h3>
                <p className="text-muted-foreground mt-2 mb-6">
                  Soon you'll be able to mark documents as favorites
                </p>
                <Button onClick={() => navigateToFolder(null)}>
                  Go to All Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <UploadDocumentDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        currentFolder={currentFolder}
      />
      
      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        currentFolder={currentFolder}
      />
      
      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={selectedDocument}
      />
      
      <MoveDocumentDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        document={selectedDocument}
      />
      
      <NewVersionDialog
        open={newVersionDialogOpen}
        onOpenChange={setNewVersionDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
};

export default Documents;


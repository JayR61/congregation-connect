
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Plus, Filter, Grid3X3, List, File, FileText, 
  FilePdf, FileImage, Folder, Share, Download, MoreVertical, 
  ChevronRight
} from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/lib/toast';
import { getDocuments, getFolders } from '@/data/mockData';

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState('root');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents', currentFolder],
    queryFn: () => getDocuments(currentFolder)
  });

  const { data: folders, isLoading: foldersLoading } = useQuery({
    queryKey: ['folders', currentFolder],
    queryFn: () => getFolders(currentFolder)
  });

  const isLoading = documentsLoading || foldersLoading;

  const handleShareDocument = (documentId: string) => {
    // In a real application, this would generate a shareable link
    toast.success("Link copied to clipboard");
  };

  const handleDownloadDocument = (documentId: string) => {
    // In a real application, this would trigger a download
    toast.success("Document download started");
  };

  const navigateToFolder = (folderId: string) => {
    setCurrentFolder(folderId);
  };

  const getIconForFileType = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return <FilePdf className="h-10 w-10 text-red-500" />;
      case 'image': return <FileImage className="h-10 w-10 text-blue-500" />;
      case 'doc': return <FileText className="h-10 w-10 text-blue-700" />;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getBreadcrumbs = () => {
    if (currentFolder === 'root') {
      return (
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">Documents</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <button 
          className="hover:text-foreground"
          onClick={() => setCurrentFolder('root')}
        >
          Documents
        </button>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span className="font-medium text-foreground">
          {folders?.find(f => f.id === currentFolder)?.name || 'Folder'}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage church documents and files</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Upload Document
          </Button>
          <Button variant="outline">
            <Folder className="mr-2 h-4 w-4" /> New Folder
          </Button>
        </div>
      </div>

      {getBreadcrumbs()}

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

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="h-12 w-12 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="border rounded-md">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-b p-4 animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-8 w-8 bg-gray-200 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-gray-200 rounded"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              {/* Display folders first */}
              {folders && folders.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3">Folders</h3>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {folders.map((folder) => (
                        <Card 
                          key={folder.id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => navigateToFolder(folder.id)}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              <Folder className="h-16 w-16 text-amber-500 mb-2" />
                              <h3 className="font-medium">{folder.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {folder.itemCount} items
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {folders.map((folder) => (
                        <div 
                          key={folder.id} 
                          className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
                          onClick={() => navigateToFolder(folder.id)}
                        >
                          <div className="flex items-center space-x-4">
                            <Folder className="h-8 w-8 text-amber-500" />
                            <div>
                              <h3 className="font-medium">{folder.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {folder.itemCount} items
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Display documents */}
              {documents && documents.length > 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-3">Documents</h3>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {documents.map((document) => (
                        <Card key={document.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col items-center text-center">
                              {getIconForFileType(document.fileType)}
                              <h3 className="font-medium mt-2">{document.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(document.size)} • {formatDate(document.dateModified)}
                              </p>
                              <div className="flex items-center space-x-2 mt-4">
                                <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(document.id)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleShareDocument(document.id)}>
                                  <Share className="h-4 w-4" />
                                </Button>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="outline">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>Preview</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem>Move</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="border rounded-md divide-y">
                      {documents.map((document) => (
                        <div key={document.id} className="p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {getIconForFileType(document.fileType)}
                            <div>
                              <h3 className="font-medium">{document.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(document.size)} • Modified {formatDate(document.dateModified)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" onClick={() => handleDownloadDocument(document.id)}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleShareDocument(document.id)}>
                              <Share className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>Preview</DropdownMenuItem>
                                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                <DropdownMenuItem>Move</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
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
                        {currentFolder === 'root' 
                          ? 'Upload your first document to get started' 
                          : 'This folder is currently empty'}
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Recent Documents</h3>
            <p className="text-muted-foreground mt-2">
              This tab would show recently accessed or modified documents
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="shared">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Shared Documents</h3>
            <p className="text-muted-foreground mt-2">
              This tab would show documents that have been shared with others
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">Favorite Documents</h3>
            <p className="text-muted-foreground mt-2">
              This tab would show documents marked as favorites
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Documents;


import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Grid3X3, List, Filter, Search, UploadCloud, FolderPlus, ChevronRight } from 'lucide-react';
import { Folder } from '@/types';

interface DocumentHeaderProps {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  showFolderNav: boolean;
  currentFolder: string | null;
  folders: Folder[];
  onSearchChange: (query: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onUploadClick: () => void;
  onCreateFolderClick: () => void;
  onNavigateToFolder: (folderId: string | null) => void;
}

const DocumentHeader = ({
  viewMode,
  searchQuery,
  showFolderNav,
  currentFolder,
  folders,
  onSearchChange,
  onViewModeChange,
  onUploadClick,
  onCreateFolderClick,
  onNavigateToFolder
}: DocumentHeaderProps) => {

  const getBreadcrumbs = () => {
    if (currentFolder === null) {
      return (
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <span className="font-medium text-foreground">Documents</span>
        </div>
      );
    }
    
    // Build the breadcrumb path
    const breadcrumbs: Folder[] = [];
    let currentFolderId = currentFolder;
    
    while (currentFolderId) {
      const folder = folders.find(f => f.id === currentFolderId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentFolderId = folder.parentId || null;
      } else {
        break;
      }
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-6 flex-wrap">
        <button 
          className="hover:text-foreground"
          onClick={() => onNavigateToFolder(null)}
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
                onClick={() => onNavigateToFolder(folder.id)}
              >
                {folder.name}
              </button>
            )}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">Manage church documents and files</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={onUploadClick}>
            <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
          </Button>
          {showFolderNav && (
            <Button variant="outline" onClick={onCreateFolderClick}>
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
            onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentHeader;


import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, MoreVertical, ChevronRight, Trash } from 'lucide-react';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Folder as FolderType, Document } from '@/types';

interface FolderDisplayProps {
  folders: FolderType[];
  documents: Document[];
  viewMode: 'grid' | 'list';
  onNavigate: (folderId: string) => void;
  onDelete: (folderId: string) => void;
}

const FolderDisplay = ({
  folders,
  documents,
  viewMode,
  onNavigate,
  onDelete
}: FolderDisplayProps) => {
  return viewMode === 'grid' ? (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {folders.map((folder) => (
        <Card 
          key={folder.id} 
          className="cursor-pointer hover:bg-muted/50 transition-colors group"
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center" 
              onClick={() => onNavigate(folder.id)}
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
                    onClick={() => onNavigate(folder.id)}
                  >
                    <ChevronRight className="mr-2 h-4 w-4" /> Open
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500"
                    onClick={() => onDelete(folder.id)}
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
      {folders.map((folder) => (
        <div 
          key={folder.id} 
          className="p-4 flex items-center justify-between hover:bg-muted/50 cursor-pointer"
        >
          <div className="flex items-center space-x-4"
            onClick={() => onNavigate(folder.id)}
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
              onClick={() => onNavigate(folder.id)}
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
                  onClick={() => onNavigate(folder.id)}
                >
                  <ChevronRight className="mr-2 h-4 w-4" /> Open
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500"
                  onClick={() => onDelete(folder.id)}
                >
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

export default FolderDisplay;

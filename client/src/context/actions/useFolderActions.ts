
import { Folder, User } from '@/types';

interface UseFolderActionsProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  currentUser: User;
}

export const useFolderActions = ({
  folders,
  setFolders,
  currentUser
}: UseFolderActionsProps) => {
  
  const addFolder = (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: currentUser.id
    };
    
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = (id: string, folder: Partial<Folder>) => {
    let found = false;
    
    setFolders(prev => 
      prev.map(f => {
        if (f.id === id) {
          found = true;
          return { 
            ...f, 
            ...folder,
            updatedAt: new Date() 
          };
        }
        return f;
      })
    );
    
    return found;
  };

  const deleteFolder = (id: string) => {
    let found = false;
    
    // Check if folder has children
    const hasChildren = folders.some(f => f.parentId === id);
    
    if (hasChildren) {
      console.error('Cannot delete folder with children');
      return false;
    }
    
    setFolders(prev => {
      const filtered = prev.filter(f => {
        if (f.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    return found;
  };

  return {
    addFolder,
    updateFolder,
    deleteFolder
  };
};

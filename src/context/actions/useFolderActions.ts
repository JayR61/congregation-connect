
import { Folder, Document, User } from '@/types';

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
  
  const updateFolder = (id: string, updatedFields: Partial<Folder>) => {
    let found = false;
    
    setFolders(prev => 
      prev.map(folder => {
        if (folder.id === id) {
          found = true;
          return { 
            ...folder, 
            ...updatedFields,
            updatedAt: new Date()
          };
        }
        return folder;
      })
    );
    
    return found;
  };
  
  const deleteFolder = (id: string) => {
    let found = false;
    
    setFolders(prev => {
      const filtered = prev.filter(folder => {
        if (folder.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    
    return found;
  };
  
  const moveDocument = (documentId: string, folderId: string | null) => {
    // Note: This would normally update the document's folderId
    // For now we'll just return true since we don't have a direct access to documents state here
    return true;
  };
  
  return {
    addFolder,
    updateFolder,
    deleteFolder,
    moveDocument
  };
};

export const addFolder = (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>, currentUser: User) => {
  return useFolderActions({ folders, setFolders, currentUser }).addFolder(folder);
};

export const updateFolder = (id: string, updatedFields: Partial<Folder>, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>, currentUser: User) => {
  return useFolderActions({ folders, setFolders, currentUser }).updateFolder(id, updatedFields);
};

export const deleteFolder = (id: string, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>, currentUser: User) => {
  return useFolderActions({ folders, setFolders, currentUser }).deleteFolder(id);
};

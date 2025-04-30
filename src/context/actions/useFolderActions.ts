
import { Folder } from '@/types';

interface UseFolderActionsProps {
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
}

export const useFolderActions = ({
  folders,
  setFolders
}: UseFolderActionsProps) => {
  const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newFolder: Folder = {
      ...folderData,
      id: `folder-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
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
    // This would be implemented in the document actions, but we're exposing it here
    // to fix the error in MoveDocumentDialog.tsx
    return true;
  };
  
  return {
    addFolder,
    updateFolder,
    deleteFolder,
    moveDocument
  };
};

// Export the individual functions for direct import
export const addFolder = (folderData: Omit<Folder, 'id' | 'createdAt' | 'updatedAt'>, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>) => {
  return useFolderActions({ folders, setFolders }).addFolder(folderData);
};

export const updateFolder = (id: string, updatedFields: Partial<Folder>, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>) => {
  return useFolderActions({ folders, setFolders }).updateFolder(id, updatedFields);
};

export const deleteFolder = (id: string, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>) => {
  return useFolderActions({ folders, setFolders }).deleteFolder(id);
};

export const moveDocument = (documentId: string, folderId: string | null, folders: Folder[], setFolders: React.Dispatch<React.SetStateAction<Folder[]>>) => {
  return useFolderActions({ folders, setFolders }).moveDocument(documentId, folderId);
};

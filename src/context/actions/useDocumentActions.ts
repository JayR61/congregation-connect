
import { Document, Folder, User } from '@/types';
import { toast } from '@/lib/toast';

interface UseDocumentActionsProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  folders: Folder[];
  setFolders: React.Dispatch<React.SetStateAction<Folder[]>>;
  currentUser: User;
}

export const useDocumentActions = ({
  documents,
  setDocuments,
  folders,
  setFolders,
  currentUser
}: UseDocumentActionsProps) => {
  
  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'versions'>) => {
    const newDocument: Document = {
      ...document,
      id: `document-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [
        {
          id: `version-${Date.now()}`,
          documentId: `document-${Date.now()}`,
          version: 1,
          url: document.url,
          createdById: currentUser.id,
          createdAt: new Date(),
          notes: "Initial version"
        }
      ]
    };
    
    setDocuments(prev => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
  };

  const updateDocument = (id: string, document: Partial<Document>) => {
    setDocuments(prev => 
      prev.map(d => {
        if (d.id === id) {
          if (document.url && document.url !== d.url) {
            const newVersion = {
              id: `version-${Date.now()}`,
              documentId: d.id,
              version: d.versions.length + 1,
              url: document.url,
              createdById: currentUser.id,
              createdAt: new Date(),
              notes: "Updated version"
            };
            
            return { 
              ...d, 
              ...document, 
              updatedAt: new Date(),
              versions: [...d.versions, newVersion]
            };
          }
          
          return { ...d, ...document, updatedAt: new Date() };
        }
        return d;
      })
    );
    toast.success("Document updated successfully");
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    toast.success("Document deleted successfully");
  };

  const addFolder = (folder: Omit<Folder, 'id' | 'createdAt' | 'updatedAt' | 'createdById'>) => {
    const newFolder: Folder = {
      ...folder,
      id: `folder-${Date.now()}`,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setFolders(prev => [...prev, newFolder]);
    toast.success("Folder created successfully");
  };

  const updateFolder = (id: string, folder: Partial<Folder>) => {
    setFolders(prev => 
      prev.map(f => 
        f.id === id 
          ? { ...f, ...folder, updatedAt: new Date() } 
          : f
      )
    );
    toast.success("Folder updated successfully");
  };

  const deleteFolder = (id: string) => {
    const hasDocuments = documents.some(d => d.folderId === id);
    const hasSubfolders = folders.some(f => f.parentId === id);
    
    if (hasDocuments || hasSubfolders) {
      toast.error("Cannot delete folder with documents or subfolders");
      return;
    }
    
    setFolders(prev => prev.filter(f => f.id !== id));
    toast.success("Folder deleted successfully");
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    addFolder,
    updateFolder,
    deleteFolder
  };
};


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
  
  const addDocument = (document: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'createdById' | 'versions'>, file?: File) => {
    // Generate a unique ID for the new document
    const documentId = `document-${Date.now()}`;
    
    // Create the document object
    const newDocument: Document = {
      ...document,
      id: documentId,
      createdById: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [
        {
          id: `version-${Date.now()}`,
          documentId: documentId,
          version: 1,
          url: document.url,
          createdById: currentUser.id,
          createdAt: new Date(),
          notes: "Initial version"
        }
      ],
      shared: false
    };
    
    setDocuments(prev => [...prev, newDocument]);
    toast.success("Document uploaded successfully");
  };

  const updateDocument = (id: string, document: Partial<Document>, file?: File) => {
    setDocuments(prev => 
      prev.map(d => {
        if (d.id === id) {
          // If URL has changed, create a new version
          if (document.url && document.url !== d.url) {
            const newVersion = {
              id: `version-${Date.now()}`,
              documentId: d.id,
              version: d.versions.length + 1,
              url: document.url,
              createdById: currentUser.id,
              createdAt: new Date(),
              notes: document.description || "Updated version"
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

  const shareDocument = (id: string, shared: boolean) => {
    setDocuments(prev => 
      prev.map(d => 
        d.id === id 
          ? { 
              ...d, 
              shared, 
              shareLink: shared ? `${window.location.origin}/documents/shared/${id}` : undefined,
              updatedAt: new Date() 
            } 
          : d
      )
    );
    
    if (shared) {
      toast.success("Document shared successfully");
    } else {
      toast.success("Document sharing disabled");
    }
  };

  const moveDocument = (id: string, folderId: string | null) => {
    setDocuments(prev => 
      prev.map(d => 
        d.id === id 
          ? { ...d, folderId, updatedAt: new Date() } 
          : d
      )
    );
    toast.success("Document moved successfully");
  };

  const addDocumentVersion = (documentId: string, url: string, notes: string) => {
    setDocuments(prev => 
      prev.map(d => {
        if (d.id === documentId) {
          const newVersion = {
            id: `version-${Date.now()}`,
            documentId,
            version: d.versions.length + 1,
            url,
            createdById: currentUser.id,
            createdAt: new Date(),
            notes
          };
          
          return { 
            ...d, 
            url, // Update the main document URL to the latest version
            updatedAt: new Date(),
            versions: [...d.versions, newVersion]
          };
        }
        return d;
      })
    );
    toast.success("New version uploaded successfully");
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    addFolder,
    updateFolder,
    deleteFolder,
    shareDocument,
    moveDocument,
    addDocumentVersion
  };
};

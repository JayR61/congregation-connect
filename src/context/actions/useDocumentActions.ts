
import { Document, User } from '@/types';

interface UseDocumentActionsProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  currentUser: User;
}

export const useDocumentActions = ({
  documents,
  setDocuments,
  currentUser
}: UseDocumentActionsProps) => {
  const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'versions'>) => {
    const newDocument: Document = {
      ...documentData,
      id: `document-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [{
        id: `version-1-${Date.now()}`,
        url: documentData.url,
        createdAt: new Date(),
        createdById: currentUser.id,
        notes: 'Initial version'
      }],
      createdById: currentUser.id,
      shared: false
    };
    
    setDocuments(prev => [...prev, newDocument]);
    return newDocument;
  };
  
  const updateDocument = (id: string, updatedFields: Partial<Document>) => {
    let found = false;
    setDocuments(prev => 
      prev.map(document => {
        if (document.id === id) {
          found = true;
          return { 
            ...document, 
            ...updatedFields,
            updatedAt: new Date()
          };
        }
        return document;
      })
    );
    return found;
  };
  
  const deleteDocument = (id: string) => {
    let found = false;
    setDocuments(prev => {
      const filtered = prev.filter(document => {
        if (document.id === id) {
          found = true;
          return false;
        }
        return true;
      });
      return filtered;
    });
    return found;
  };
  
  const addDocumentVersion = (documentId: string, version: { url: string, notes?: string }) => {
    let found = false;
    
    setDocuments(prev => 
      prev.map(document => {
        if (document.id === documentId) {
          found = true;
          const newVersion = {
            id: `version-${document.versions.length + 1}-${Date.now()}`,
            url: version.url,
            createdAt: new Date(),
            createdById: currentUser.id,
            notes: version.notes || ''
          };
          
          return { 
            ...document,
            url: version.url, // Update the document's main URL to the new version
            versions: [...document.versions, newVersion],
            updatedAt: new Date()
          };
        }
        return document;
      })
    );
    
    return found;
  };
  
  return {
    addDocument,
    updateDocument,
    deleteDocument,
    addDocumentVersion
  };
};

export const addDocument = (documentData: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'versions'>, documents: Document[], setDocuments: React.Dispatch<React.SetStateAction<Document[]>>, currentUser: User) => {
  return useDocumentActions({ documents, setDocuments, currentUser }).addDocument(documentData);
};

export const updateDocument = (id: string, updatedFields: Partial<Document>, documents: Document[], setDocuments: React.Dispatch<React.SetStateAction<Document[]>>, currentUser: User) => {
  return useDocumentActions({ documents, setDocuments, currentUser }).updateDocument(id, updatedFields);
};

export const deleteDocument = (id: string, documents: Document[], setDocuments: React.Dispatch<React.SetStateAction<Document[]>>, currentUser: User) => {
  return useDocumentActions({ documents, setDocuments, currentUser }).deleteDocument(id);
};

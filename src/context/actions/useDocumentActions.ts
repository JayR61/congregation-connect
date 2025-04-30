
import { Document, User, DocumentVersion } from '@/types';

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
        documentId: `document-${Date.now()}`,
        version: 1,
        url: documentData.url,
        uploadedById: currentUser.id,
        createdAt: new Date(),
        notes: 'Initial version',
        size: documentData.fileSize || 0,
        createdById: currentUser.id
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
  
  const addDocumentVersion = (documentId: string, fileUrl: string, notes: string) => {
    let found = false;
    
    setDocuments(prev => 
      prev.map(document => {
        if (document.id === documentId) {
          found = true;
          const newVersion: DocumentVersion = {
            id: `version-${document.versions.length + 1}-${Date.now()}`,
            documentId,
            version: document.versions.length + 1,
            url: fileUrl,
            uploadedById: currentUser.id,
            createdAt: new Date(),
            notes: notes || '',
            size: document.fileSize || 0,
            createdById: currentUser.id
          };
          
          return { 
            ...document,
            url: fileUrl, // Update the document's main URL to the new version
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


import { v4 as uuidv4 } from 'uuid';
import { Document, DocumentVersion, Folder } from '@/types';

export const useDocumentActions = ({
  documents,
  setDocuments,
  folders,
  setFolders,
  currentUser
}) => {
  // Document CRUD operations
  const addDocument = (document) => {
    try {
      const now = new Date();
      const newDocument = {
        ...document,
        id: uuidv4(),
        title: document.name || 'Untitled Document',
        uploadedById: currentUser?.id || 'unknown',
        uploadDate: now,
        versions: [{
          id: uuidv4(),
          versionNumber: 1,
          version: 1,
          uploadDate: now,
          fileUrl: document.url || '',
          url: document.url || '',
          uploadedById: currentUser?.id || 'unknown',
          createdAt: now,
          createdById: currentUser?.id || 'unknown',
          notes: 'Initial version'
        }],
        tags: document.tags || [],
        createdAt: now,
        updatedAt: now
      };
      
      setDocuments(prevDocuments => [...prevDocuments, newDocument]);
      return newDocument;
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    }
  };

  const updateDocument = (id, updatedFields) => {
    try {
      let found = false;
      
      setDocuments(prev => {
        return prev.map(doc => {
          if (doc.id === id) {
            found = true;
            return {
              ...doc,
              ...updatedFields,
              updatedAt: new Date()
            };
          }
          return doc;
        });
      });
      
      return found;
    } catch (error) {
      console.error('Error updating document:', error);
      return false;
    }
  };

  const deleteDocument = (id) => {
    try {
      let found = false;
      
      setDocuments(prev => {
        const filtered = prev.filter(doc => {
          if (doc.id === id) {
            found = true;
            return false;
          }
          return true;
        });
        return filtered;
      });
      
      return found;
    } catch (error) {
      console.error('Error deleting document:', error);
      return false;
    }
  };

  // Folder CRUD operations
  const addFolder = (folder) => {
    try {
      const newFolder = {
        ...folder,
        id: uuidv4()
      };
      
      setFolders(prev => [...prev, newFolder]);
      return newFolder;
    } catch (error) {
      console.error('Error adding folder:', error);
      throw error;
    }
  };

  const updateFolder = (id, updatedFields) => {
    try {
      let found = false;
      
      setFolders(prev => {
        return prev.map(folder => {
          if (folder.id === id) {
            found = true;
            return {
              ...folder,
              ...updatedFields
            };
          }
          return folder;
        });
      });
      
      return found;
    } catch (error) {
      console.error('Error updating folder:', error);
      return false;
    }
  };

  const deleteFolder = (id) => {
    try {
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
      
      // Also update documents that were in this folder to be root level
      setDocuments(prev => {
        return prev.map(doc => {
          if (doc.folderId === id) {
            return { ...doc, folderId: null };
          }
          return doc;
        });
      });
      
      return found;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return false;
    }
  };

  // Additional document operations
  const addDocumentVersion = (documentId, fileUrl, notes = 'Updated version') => {
    try {
      let updated = false;
      const now = new Date();
      
      setDocuments(prev => {
        return prev.map(doc => {
          if (doc.id === documentId) {
            const newVersionNumber = doc.versions.length + 1;
            const newVersion: DocumentVersion = {
              id: uuidv4(),
              versionNumber: newVersionNumber,
              version: newVersionNumber,
              uploadDate: now,
              fileUrl: fileUrl,
              url: fileUrl,
              uploadedById: currentUser?.id || 'unknown',
              createdAt: now,
              createdById: currentUser?.id || 'unknown',
              notes
            };
            
            updated = true;
            return {
              ...doc,
              versions: [...doc.versions, newVersion],
              updatedAt: now
            };
          }
          return doc;
        });
      });
      
      return updated;
    } catch (error) {
      console.error('Error adding document version:', error);
      return false;
    }
  };

  const moveDocument = (documentId, folderId) => {
    try {
      return updateDocument(documentId, { folderId });
    } catch (error) {
      console.error('Error moving document:', error);
      return false;
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    addFolder,
    updateFolder,
    deleteFolder,
    addDocumentVersion,
    moveDocument
  };
};

export default useDocumentActions;

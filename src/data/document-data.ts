import { Document, Folder } from '@/types';

// OTHER MOCK DATA
export const mockDocuments: Document[] = [];
export const mockFolders: Folder[] = [];

// Export directly for compatibility
export const documents = mockDocuments;
export const folders = mockFolders;

// Helper function to get documents by folder
export const getDocumentsByFolder = (folderId: string | null) => {
  return mockDocuments.filter(doc => doc.folderId === folderId);
};

// Helper function to get folder path
export const getFolderPath = (folderId: string | null): string => {
  if (!folderId) return 'Root';
  
  const folder = mockFolders.find(f => f.id === folderId);
  if (!folder) return 'Unknown';
  
  if (!folder.parentId) return folder.name;
  
  return `${getFolderPath(folder.parentId)} > ${folder.name}`;
};

// Helper function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

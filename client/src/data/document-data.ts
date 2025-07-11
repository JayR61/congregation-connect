import { Document, Folder } from '@/types';

// DOCUMENTS - All documents start empty, users must upload
export const mockDocuments: Document[] = [];

// FOLDERS - Start with some basic folders
export const mockFolders: Folder[] = [
  {
    id: "folder-1",
    name: "Governance",
    parentId: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    createdById: "user-1"
  },
  {
    id: "folder-2",
    name: "Worship & Services",
    parentId: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    createdById: "user-2"
  },
  {
    id: "folder-3",
    name: "Ministries",
    parentId: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    createdById: "user-3"
  },
  {
    id: "folder-4",
    name: "Finance",
    parentId: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    createdById: "user-4"
  }
];

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
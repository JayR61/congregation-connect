import { Document, Folder } from '@/types';

// OTHER MOCK DATA
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    name: "Church Constitution.pdf",
    folderId: "folder-1",
    createdAt: new Date(2024, 0, 15),
    updatedAt: new Date(2024, 0, 15),
    createdBy: "user-1",
    fileType: "pdf",
    fileSize: 2048576,
    url: "/documents/constitution.pdf",
    description: "Official church constitution and bylaws",
    tags: ["legal", "governance", "important"],
    shared: true,
    versions: [{
      id: "version-1",
      documentId: "doc-1",
      version: 1,
      createdAt: new Date(2024, 0, 15),
      createdBy: "user-1",
      fileSize: 2048576,
      url: "/documents/constitution.pdf"
    }]
  },
  {
    id: "doc-2",
    name: "Service Planning Template.docx",
    folderId: "folder-2",
    createdAt: new Date(2024, 1, 10),
    updatedAt: new Date(2024, 1, 20),
    createdBy: "user-2",
    fileType: "docx",
    fileSize: 524288,
    url: "/documents/service-template.docx",
    description: "Template for planning weekly services",
    tags: ["template", "worship", "planning"],
    shared: true,
    versions: [{
      id: "version-2",
      documentId: "doc-2",
      version: 1,
      createdAt: new Date(2024, 1, 10),
      createdBy: "user-2",
      fileSize: 524288,
      url: "/documents/service-template.docx"
    }]
  },
  {
    id: "doc-3",
    name: "Youth Ministry Guidelines.pdf",
    folderId: "folder-3",
    createdAt: new Date(2024, 2, 5),
    updatedAt: new Date(2024, 2, 5),
    createdBy: "user-3",
    fileType: "pdf",
    fileSize: 1572864,
    url: "/documents/youth-guidelines.pdf",
    description: "Comprehensive guidelines for youth ministry activities",
    tags: ["youth", "ministry", "guidelines"],
    shared: false,
    versions: [{
      id: "version-3",
      documentId: "doc-3",
      version: 1,
      createdAt: new Date(2024, 2, 5),
      createdBy: "user-3",
      fileSize: 1572864,
      url: "/documents/youth-guidelines.pdf"
    }]
  },
  {
    id: "doc-4",
    name: "Budget Proposal 2024.xlsx",
    folderId: "folder-4",
    createdAt: new Date(2024, 0, 20),
    updatedAt: new Date(2024, 1, 15),
    createdBy: "user-4",
    fileType: "xlsx",
    fileSize: 786432,
    url: "/documents/budget-2024.xlsx",
    description: "Annual budget proposal and financial planning",
    tags: ["finance", "budget", "planning", "2024"],
    shared: true,
    versions: [{
      id: "version-4",
      documentId: "doc-4",
      version: 2,
      createdAt: new Date(2024, 1, 15),
      createdBy: "user-4",
      fileSize: 786432,
      url: "/documents/budget-2024-v2.xlsx"
    }]
  },
  {
    id: "doc-5",
    name: "Mission Statement.pdf",
    folderId: null,
    createdAt: new Date(2024, 0, 1),
    updatedAt: new Date(2024, 0, 1),
    createdBy: "user-1",
    fileType: "pdf",
    fileSize: 204800,
    url: "/documents/mission-statement.pdf",
    description: "Official church mission statement and vision",
    tags: ["mission", "vision", "core-documents"],
    shared: true,
    versions: [{
      id: "version-5",
      documentId: "doc-5",
      version: 1,
      createdAt: new Date(2024, 0, 1),
      createdBy: "user-1",
      fileSize: 204800,
      url: "/documents/mission-statement.pdf"
    }]
  }
];

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
  },
  {
    id: "folder-5",
    name: "Youth Ministry",
    parentId: "folder-3",
    createdAt: new Date(2024, 0, 10),
    updatedAt: new Date(2024, 0, 10),
    createdById: "user-3"
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

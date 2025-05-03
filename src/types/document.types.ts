
export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById?: string;
}

export interface Document {
  id: string;
  name: string;
  folderId: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  fileType: string;
  fileSize: number;
  url: string;
  description?: string;
  tags?: string[];
  lastModifiedBy?: string;
  versions: DocumentVersion[];
  // Additional fields that are used in components
  title?: string;
  thumbnailUrl?: string;
  shared?: boolean;
  content?: string;
  uploadedById?: string;
  size?: number; // Alias for fileSize in some places
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  createdAt: Date;
  createdBy: string;
  fileSize: number;
  url: string;
  notes?: string;
  createdById?: string;
  uploadedById?: string;
}

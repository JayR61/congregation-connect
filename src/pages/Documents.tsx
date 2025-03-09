
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Document, Folder } from '@/types';

// Import the components
import DocumentHeader from "@/components/documents/DocumentHeader";
import FolderDisplay from "@/components/documents/FolderDisplay";
import DocumentGrid from "@/components/documents/DocumentGrid";
import DocumentList from "@/components/documents/DocumentList";
import NoDocuments from "@/components/documents/NoDocuments";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";
import CreateFolderDialog from "@/components/documents/CreateFolderDialog";
import DocumentPreviewDialog from "@/components/documents/DocumentPreviewDialog";
import MoveDocumentDialog from "@/components/documents/MoveDocumentDialog";
import NewVersionDialog from "@/components/documents/NewVersionDialog";

const Documents = () => {
  const { documents, folders, deleteDocument, deleteFolder, shareDocument } = useAppContext();
  
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('all');
  
  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [createFolderDialogOpen, setCreateFolderDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [newVersionDialogOpen, setNewVersionDialogOpen] = useState(false);
  
  // Filtered data based on current folder and search
  const filteredFolders = folders.filter(folder => {
    const matchesFolder = folder.parentId === currentFolder;
    const matchesSearch = searchQuery ? 
      folder.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    return matchesFolder && matchesSearch;
  });
  
  const getFilteredDocuments = () => {
    return documents.filter(doc => {
      if (activeTab === 'recent') {
        // Show documents modified in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(doc.updatedAt) >= sevenDaysAgo;
      } else if (activeTab === 'shared') {
        return doc.shared;
      } else if (activeTab === 'favorites') {
        // This could be implemented with a 'favorite' flag in the future
        return false;
      } else {
        // All documents tab - filter by folder and search
        const matchesFolder = doc.folderId === currentFolder;
        const matchesSearch = searchQuery ? 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
        return matchesFolder && matchesSearch;
      }
    });
  };
  
  // Memoize filtered documents to improve performance
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  
  // Update filtered documents when dependencies change
  useEffect(() => {
    setFilteredDocuments(getFilteredDocuments());
  }, [documents, activeTab, currentFolder, searchQuery]);
  
  // Sort folders and documents by name
  const sortedFolders = [...filteredFolders].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const sortedDocuments = [...filteredDocuments].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Handlers
  const handleShareDocument = (document: Document) => {
    shareDocument(document.id, !document.shared);
  };
  
  const handleDownloadDocument = (document: Document) => {
    window.open(document.url, '_blank');
  };
  
  const handlePreviewDocument = (document: Document) => {
    setSelectedDocument(document);
    setPreviewDialogOpen(true);
  };
  
  const handleMoveDocument = (document: Document) => {
    setSelectedDocument(document);
    setMoveDialogOpen(true);
  };
  
  const handleNewVersion = (document: Document) => {
    setSelectedDocument(document);
    setNewVersionDialogOpen(true);
  };
  
  const navigateToFolder = (folderId: string | null) => {
    setCurrentFolder(folderId);
    // When navigating to a folder, always switch to the 'all' tab
    setActiveTab('all');
  };
  
  // When changing tabs, we may need to adjust what's displayed
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  // Only show folder navigation when in the "All Documents" tab
  const showFolderNav = activeTab === 'all';
  
  return (
    <div className="p-6">
      <DocumentHeader 
        viewMode={viewMode}
        searchQuery={searchQuery}
        showFolderNav={showFolderNav}
        currentFolder={currentFolder}
        folders={folders}
        onSearchChange={setSearchQuery}
        onViewModeChange={setViewMode}
        onUploadClick={() => setUploadDialogOpen(true)}
        onCreateFolderClick={() => setCreateFolderDialogOpen(true)}
        onNavigateToFolder={navigateToFolder}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {showFolderNav && sortedFolders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Folders</h3>
              <FolderDisplay 
                folders={sortedFolders}
                documents={documents}
                viewMode={viewMode}
                onNavigate={navigateToFolder}
                onDelete={deleteFolder}
              />
            </div>
          )}
          
          {/* Documents */}
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Documents</h3>
              {viewMode === 'grid' ? (
                <DocumentGrid 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              ) : (
                <DocumentList 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              )}
            </div>
          ) : (
            <NoDocuments 
              type="all"
              currentFolder={currentFolder}
              onUpload={() => setUploadDialogOpen(true)}
              onNavigateToRoot={() => navigateToFolder(null)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="recent">
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Recent Documents</h3>
              {viewMode === 'grid' ? (
                <DocumentGrid 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              ) : (
                <DocumentList 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              )}
            </div>
          ) : (
            <NoDocuments 
              type="recent"
              currentFolder={currentFolder}
              onUpload={() => setUploadDialogOpen(true)}
              onNavigateToRoot={() => navigateToFolder(null)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="shared">
          {sortedDocuments.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium mb-3">Shared Documents</h3>
              {viewMode === 'grid' ? (
                <DocumentGrid 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              ) : (
                <DocumentList 
                  documents={sortedDocuments}
                  onPreview={handlePreviewDocument}
                  onDownload={handleDownloadDocument}
                  onShare={handleShareDocument}
                  onNewVersion={handleNewVersion}
                  onMove={handleMoveDocument}
                  onDelete={deleteDocument}
                />
              )}
            </div>
          ) : (
            <NoDocuments 
              type="shared"
              currentFolder={currentFolder}
              onUpload={() => setUploadDialogOpen(true)}
              onNavigateToRoot={() => navigateToFolder(null)}
            />
          )}
        </TabsContent>
        
        <TabsContent value="favorites">
          <NoDocuments 
            type="favorites"
            currentFolder={currentFolder}
            onUpload={() => setUploadDialogOpen(true)}
            onNavigateToRoot={() => navigateToFolder(null)}
          />
        </TabsContent>
      </Tabs>
      
      {/* Dialogs */}
      <UploadDocumentDialog 
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        currentFolder={currentFolder}
      />
      
      <CreateFolderDialog
        open={createFolderDialogOpen}
        onOpenChange={setCreateFolderDialogOpen}
        currentFolder={currentFolder}
      />
      
      <DocumentPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        document={selectedDocument}
      />
      
      <MoveDocumentDialog
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        document={selectedDocument}
      />
      
      <NewVersionDialog
        open={newVersionDialogOpen}
        onOpenChange={setNewVersionDialogOpen}
        document={selectedDocument}
      />
    </div>
  );
};

export default Documents;

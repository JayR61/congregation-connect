
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Share, UploadCloud, StarIcon } from 'lucide-react';

interface NoDocumentsProps {
  type: 'all' | 'recent' | 'shared' | 'favorites';
  currentFolder: string | null;
  onUpload: () => void;
  onNavigateToRoot: () => void;
}

const NoDocuments = ({ type, currentFolder, onUpload, onNavigateToRoot }: NoDocumentsProps) => {
  let icon = <FileText className="h-16 w-16 text-muted-foreground mb-4" />;
  let title = 'No documents found';
  let message = 'Upload your first document to get started';
  let action = (
    <Button onClick={onUpload}>
      <UploadCloud className="mr-2 h-4 w-4" /> Upload Document
    </Button>
  );

  switch (type) {
    case 'all':
      message = currentFolder === null 
        ? 'Upload your first document to get started' 
        : 'This folder is currently empty';
      break;
    case 'recent':
      title = 'No recent documents';
      message = 'Documents modified in the last 7 days will appear here';
      break;
    case 'shared':
      icon = <Share className="h-16 w-16 text-muted-foreground mb-4" />;
      title = 'No shared documents';
      message = 'Share documents with others to see them here';
      action = (
        <Button onClick={onNavigateToRoot}>
          Go to All Documents
        </Button>
      );
      break;
    case 'favorites':
      icon = <StarIcon className="h-16 w-16 text-muted-foreground mb-4" />;
      title = 'Favorites Coming Soon';
      message = 'Soon you\'ll be able to mark documents as favorites';
      action = (
        <Button onClick={onNavigateToRoot}>
          Go to All Documents
        </Button>
      );
      break;
  }

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <div className="flex flex-col items-center py-8">
          {icon}
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            {message}
          </p>
          {action}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoDocuments;


// Just updating the one spot where shareDocument is used
export const updateDocumentSharing = (document: any, shareDocument: any) => {
  // Changed from boolean to string array (empty array to unshare, or array with IDs to share with)
  shareDocument(document.id, document.shared ? [] : ['all-users']);
};


import { Document, DocumentVersion, User } from "@/types";

interface UseDocumentActionsProps {
  documents: Document[];
  setDocuments: React.Dispatch<React.SetStateAction<Document[]>>;
  currentUser: User;
}

export const useDocumentActions = ({
  documents,
  setDocuments,
  currentUser,
}: UseDocumentActionsProps) => {
  const addDocument = (document: Omit<Document, "id" | "createdAt" | "updatedAt">) => {
    const docId = `doc-${Date.now()}`;
    const newDocument = {
      ...document,
      id: docId,
      createdAt: new Date(),
      updatedAt: new Date(),
      versions: [
        {
          id: `version-${Date.now()}`,
          documentId: docId,
          version: 1,
          createdAt: new Date(),
          createdBy: currentUser.id,
          fileSize: document.fileSize,
          url: document.url,
        },
      ],
    };

    setDocuments((prev) => [...prev, newDocument]);
  };

  const updateDocument = (id: string, document: Partial<Document>) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, ...document, updatedAt: new Date() }
          : d
      )
    );
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addDocumentVersion = (
    documentId: string,
    fileUrl: string,
    notes: string = ""
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === documentId) {
          const latestVersion = doc.versions.reduce(
            (max, v) => (v.version > max ? v.version : max),
            0
          );

          const newVersion: DocumentVersion = {
            id: `version-${Date.now()}`,
            documentId,
            version: latestVersion + 1,
            createdAt: new Date(),
            createdBy: currentUser.id,
            fileSize: doc.fileSize, // Assuming same size for simplicity
            url: fileUrl,
            notes,
          };

          return {
            ...doc,
            url: fileUrl, // Update the main document URL to the latest version
            updatedAt: new Date(),
            versions: [...doc.versions, newVersion],
          };
        }

        return doc;
      })
    );
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    addDocumentVersion,
  };
};


import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { Upload } from "lucide-react";

interface FileUploadFieldProps {
  onFileChange: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  label: string;
  preview?: string;
  icon?: React.ReactNode;
}

const FileUploadField = ({
  onFileChange,
  accept = "image/*",
  maxSize = 2, // 2MB default
  label,
  preview,
  icon
}: FileUploadFieldProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    // Create preview
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    
    // Call the callback
    onFileChange(file);
  };
  
  return (
    <div className="flex items-center space-x-4">
      <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
        ) : (
          icon
        )}
      </div>
      <div>
        <input
          type="file"
          id="file-upload"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="file-upload">
          <Button variant="outline" type="button" asChild>
            <span>
              <Upload className="mr-2 h-4 w-4" />
              {label}
            </span>
          </Button>
        </label>
        <p className="text-sm text-muted-foreground mt-1">
          Max file size: {maxSize}MB
        </p>
      </div>
    </div>
  );
};

export default FileUploadField;

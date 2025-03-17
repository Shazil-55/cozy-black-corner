
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { useSocketProgress } from '@/hooks/useSocketProgress';
import { readFileContent } from '@/utils/fileProcessor';

export type FileStatus = 'idle' | 'uploading' | 'success' | 'error';

interface DocumentUploadProps {
  onFileAccepted: (file: File, characterCount?: number) => void;
  status?: FileStatus;
  progress?: number;
  maxSize?: number; // in bytes
  className?: string;
}

export const DocumentUpload = ({
  onFileAccepted,
  status = 'idle',
  progress = 0,
  maxSize = 10485760, // 10MB default
  className,
}: DocumentUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const { socket } = useSocketProgress();
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      
      // If we have a socket, use it to track progress
      if (socket) {
        socket.emit('progress', {
          progress: '0%',
          status: 'starting',
          message: `Processing ${selectedFile.name}`
        });
        
        try {
          // Process file with socket for progress updates
          const result = await readFileContent(selectedFile, socket);
          onFileAccepted(selectedFile, result.characterCount);
        } catch (error) {
          console.error("Error processing file:", error);
          toast.error("Error processing file", {
            description: error instanceof Error ? error.message : "Unknown error occurred",
          });
        }
      } else {
        // Fallback if no socket is available
        onFileAccepted(selectedFile);
      }
    }
  }, [onFileAccepted, socket]);
  
  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });
  
  React.useEffect(() => {
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        toast.error(`File is too large. Max size is ${maxSize / 1024 / 1024}MB`);
      } else {
        toast.error(`Invalid file: ${rejection.errors[0].message}`);
      }
    }
  }, [fileRejections, maxSize]);
  
  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
  };
  
  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case "uploading": return 'border-talentlms-blue bg-talentlms-lightBlue/50';
      case "success": return 'border-talentlms-success bg-talentlms-success/10';
      case "error": return 'border-talentlms-error bg-talentlms-error/10';
      default: return 'border-gray-200 hover:border-talentlms-blue hover:bg-talentlms-lightBlue/20';
    }
  };
  
  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className={cn("w-full", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative border-2 border-dashed rounded-md transition-all duration-200",
          "p-6 flex flex-col items-center justify-center text-center cursor-pointer",
          isDragActive ? "border-talentlms-blue bg-talentlms-lightBlue/30" : getStatusColor(status),
          file ? "py-6" : "py-10",
        )}
      >
        <input {...getInputProps()} />
        
        {!file && (
          <>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              "bg-talentlms-blue text-white",
              isDragActive && "animate-pulse-soft"
            )}>
              <Upload size={24} />
            </div>
            
            <h3 className="font-medium text-lg mb-2">
              {isDragActive ? 'Drop your document here' : 'Upload your document'}
            </h3>
            
            <p className="text-muted-foreground text-sm mb-4 max-w-md">
              PDF, DOCX, PPT, PPTX, or TXT files up to {maxSize / 1024 / 1024}MB
            </p>
            
            <Button
              type="button"
              variant="outline"
              className="bg-white shadow-subtle border border-gray-200 hover:border-talentlms-blue"
            >
              Browse Files
            </Button>
          </>
        )}
        
        {file && (
          <div className="w-full animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-talentlms-blue flex items-center justify-center">
                  <FileText size={18} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{getFileSize(file.size)}</p>
                </div>
              </div>
              
              {status === 'idle' && (
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X size={16} />
                </button>
              )}
              
              {status === 'success' && (
                <CheckCircle2 size={18} className="text-talentlms-success" />
              )}
              
              {status === 'error' && (
                <AlertCircle size={18} className="text-talentlms-error" />
              )}
            </div>
            
            {status === 'uploading' && (
              <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2">
                <div
                  className="h-full bg-talentlms-blue rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

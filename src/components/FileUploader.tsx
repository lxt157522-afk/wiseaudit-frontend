import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { AuditDocument } from '../types';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
  files: AuditDocument[];
  onRemove: (id: string) => void;
}

export function FileUploader({ onFilesAdded, files, onRemove }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesAdded(acceptedFiles);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer flex flex-col items-center justify-center text-center",
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mb-4" />
        <p className="text-sm font-medium text-gray-600">
          {isDragActive ? "松开以添加文件" : "拖拽或点击上传审计证据材料"}
        </p>
        <p className="text-xs text-gray-400 mt-2">支持 PDF, JPG, PNG 格式</p>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((doc) => (
            <div
              key={doc.id}
              className="relative group bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-3 hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-50 p-2 rounded">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                <p className="text-xs text-gray-500 uppercase">{doc.type}</p>
                <div className="mt-1 flex items-center">
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase",
                    doc.status === 'completed' ? "bg-green-100 text-green-700" :
                    doc.status === 'processing' ? "bg-blue-100 text-blue-700 animate-pulse" :
                    doc.status === 'failed' ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {doc.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(doc.id)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

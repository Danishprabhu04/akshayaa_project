import { motion } from 'framer-motion';
import { Upload, Image, FileText, X } from 'lucide-react';
import { useCallback, useState } from 'react';

interface DroppedFile {
  file: File;
  id: string;
  preview?: string;
}

interface DropzoneProps {
  onFilesUploaded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
}

export default function Dropzone({
  onFilesUploaded,
  accept = 'image/*',
  multiple = false,
  maxSize = 10,
  className = '',
}: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<DroppedFile[]>([]);
  const [error, setError] = useState<string>('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }
    
    if (accept && !accept.includes(file.type)) {
      return 'File type not supported';
    }
    
    return null;
  };

  const processFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    
    const newFiles: DroppedFile[] = [];
    const validFiles: File[] = [];
    let hasError = false;

    Array.from(fileList).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
        return;
      }

      const id = Math.random().toString(36).substring(2, 9);
      const droppedFile: DroppedFile = { file, id };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          droppedFile.preview = e.target?.result as string;
          setFiles((prev) => prev.map((f) => (f.id === id ? droppedFile : f)));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(droppedFile);
      validFiles.push(file);
    });

    if (!hasError) {
      setError('');
      if (multiple) {
        setFiles((prev) => [...prev, ...newFiles]);
      } else {
        setFiles(newFiles);
      }
      onFilesUploaded(validFiles);
    }
  }, [accept, maxSize, multiple, onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={className}>
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300
          ${dragActive
            ? 'border-primary-500 bg-primary-50/50 scale-105'
            : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/20'
          }
          glass-card backdrop-blur-lg
        `}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="File upload"
        />
        
        <div className="space-y-4">
          <div className={`
            mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors
            ${dragActive ? 'bg-primary-500' : 'bg-primary-100'}
          `}>
            <Upload className={`h-6 w-6 ${dragActive ? 'text-white' : 'text-primary-600'}`} />
          </div>
          
          <div>
            <p className="text-lg font-medium text-text-primary">
              {dragActive ? 'Drop files here' : 'Upload your skin image'}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Drag and drop or click to select files
            </p>
            <p className="text-xs text-text-secondary mt-2">
              Supported formats: JPG, PNG, HEIC • Max size: {maxSize}MB
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-error-600 mt-2 bg-error-50 px-3 py-2 rounded-lg"
        >
          {error}
        </motion.p>
      )}

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-3"
        >
          <h4 className="text-sm font-medium text-text-primary">Selected Files:</h4>
          {files.map((droppedFile) => (
            <motion.div
              key={droppedFile.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3 p-3 glass-card rounded-xl border border-white/10"
            >
              <div className="flex-shrink-0">
                {droppedFile.preview ? (
                  <img
                    src={droppedFile.preview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {droppedFile.file.type.startsWith('image/') ? (
                      <Image className="h-6 w-6 text-gray-400" />
                    ) : (
                      <FileText className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {droppedFile.file.name}
                </p>
                <p className="text-xs text-text-secondary">
                  {(droppedFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              
              <button
                onClick={() => removeFile(droppedFile.id)}
                className="flex-shrink-0 p-1 rounded-md text-text-secondary hover:text-error-600 focus-ring"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
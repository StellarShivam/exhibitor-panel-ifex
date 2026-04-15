import { useRef, useState } from "react";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from 'src/config-global';
import DownloadIcon from '@mui/icons-material/Download';

const API_URL = `${BASE_URL}/api/v1`;

export const FileUploadBox = ({
  label,
  accept,
  error,
  onChange,
  preview,
  onDelete,
  helperText,
  errorMessage,
  required,
  disabled,
}: {
  label: string;
  accept: string;
  error?: boolean;
  onChange: (fileUrl: string) => void;
  preview?: string;
  onDelete?: () => void;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | undefined>();
  const [isImage, setIsImage] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setLocalError(undefined);
    setFileName(file.name);
    setIsImage(file.type.startsWith("image/"));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${API_URL}/file/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        onChange(response.data.metaData.storeUrl);
      } else {
        setLocalError("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("File upload error:", error);
      setLocalError("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const validateAndHandleFile = (file: File) => {
    const maxSizeInBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setLocalError("File size must be less than 5MB");
      return;
    }
    uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files?.length) {
      const file = files[0];
      if (file.type.match(accept.replace(/\*/g, ".*"))) {
        validateAndHandleFile(file);
      }
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-700 font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
            ${isDragging
            ? "border-[#ffa206] bg-pink-50"
            : error
              ? "border-red-500"
              : "border-gray-300"
          }
            ${preview ? "bg-gray-50" : "hover:bg-gray-50"
          } transition-colors duration-200`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <div className="relative">
            {isImage || /\.(png|jpe?g|gif|webp)$/i.test(preview) ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-32 mx-auto rounded object-contain"
              />
            ) : /\.pdf(\?.*)?$/i.test(preview) ? (
              <iframe
                src={preview}
                title="PDF Preview"
                className="w-full h-screen mx-auto rounded"
              />
            ) : (
              <img src="/pdfLogo.png" alt="PDF Preview" className="max-h-32 mx-auto rounded" />
            )}
            {fileName && (
              <p className="text-sm text-gray-600 mt-2 truncate max-w-full">{fileName}</p>
            )}
            {disabled ? (
              <div className="absolute top-0 right-0">
                <div className="flex items-center gap-2">
                  {/* <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenPdfImgViewModal(true);
                    }}
                    className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="View file"
                  >
                    <VisibilityIcon fontSize="small" />
                  </button> */}
                  <button
                    type="button"
                    onClick={() => {
                      window.open(preview, '_blank');
                    }}
                    className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    title="Download file"
                  >
                    <DownloadIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ) : (
              onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    setLocalError(undefined);
                    setFileName(undefined);
                    setIsImage(false);
                  }}
                  className="absolute top-0 right-0 p-1 bg-[#ffa206] text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <DeleteIcon fontSize="small" />
                </button>
              )
            )}
          </div>
        ) : (
          <div className="space-y-2 py-4">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ffa206]"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            ) : (
              <>
                <CloudUploadIcon sx={{ fontSize: 40, color: "#ffa206" }} />
                <div className="text-sm text-gray-600">
                  Drag and drop your file here or click to browse
                </div>
                <div className="text-xs text-gray-500">{helperText}</div>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndHandleFile(file);
        }}
        className="hidden"
        disabled={disabled || isUploading}
      />
      {(localError || errorMessage) && (
        <p className="text-red-500 text-sm mt-1">
          {localError || errorMessage}
        </p>
      )}
    </div>
  );
};

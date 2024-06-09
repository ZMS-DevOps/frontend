import { FileUploadItem } from './upload-item';

export interface FileUploadState {
  totalProgress: number;
  failedUploads: FileUploadItem[];
  activeUploads: FileUploadItem[];
  completeUploads: FileUploadItem[];
  uploadItems: FileUploadItem[];
}

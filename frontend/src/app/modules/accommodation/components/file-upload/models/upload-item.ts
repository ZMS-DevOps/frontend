export interface FileUploadItem {
  id: number;
  fileName: string;
  fileType: string;
  progress: number;
  retry(): void;
  cancel(): void;
  delete(): void;
  error?: string;
}

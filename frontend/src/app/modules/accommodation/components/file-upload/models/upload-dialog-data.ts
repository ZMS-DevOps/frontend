import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

import { FileUploadItem } from './upload-item';

export interface FileUploadDialogData {
  uploadItems$: Observable<FileUploadItem[]>;
  uploadItemActionTemplate: TemplateRef<unknown>;
}

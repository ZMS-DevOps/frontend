import { Component, Inject, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { FileUploadDialogData } from '../../models/upload-dialog-data';
import { FileUploadItem } from '../../models/upload-item';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss'],
})
export class FileUploadDialogComponent {
  _uploadItems$: Observable<FileUploadItem[]>;
  _uploadItemActionTemplate: TemplateRef<unknown>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _uploadData: FileUploadDialogData
  ) {
    this._uploadItems$ = this._uploadData.uploadItems$;
    this._uploadItemActionTemplate = this._uploadData.uploadItemActionTemplate;
  }

  _trackBy(index: number, uploadItem: FileUploadItem) {
    return uploadItem.id;
  }
}

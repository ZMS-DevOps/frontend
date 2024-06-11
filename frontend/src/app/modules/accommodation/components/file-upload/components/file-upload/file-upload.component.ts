import { Directionality } from '@angular/cdk/bidi';
import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { fadeInOutTrigger } from '../../animations/fade-in-out';

import { FileUploadInputDirective } from '../../directives/file-input.directive';
import { FileUploadItemActionDirective } from '../../directives/file-upload-item-action.directive';
import { FileUploadDialogData } from '../../models/upload-dialog-data';
import { FileUploadSource } from '../../models/upload-source';
import { FileUploadState } from '../../models/upload-state';
import { FileUploadService } from '../../services/file-upload.service';
import { FileUploadDialogComponent } from '../file-upload-dialog/file-upload-dialog.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [FileUploadService],
  animations: [fadeInOutTrigger],
})
export class FileUploadComponent {
  _uploadState$: Observable<FileUploadState>;

  @ContentChild(FileUploadInputDirective, { read: ElementRef })
  _fileInputRef?: ElementRef<HTMLInputElement>;

  @ContentChild(FileUploadItemActionDirective, { read: TemplateRef })
  _customUploadItemActionTemplate?: TemplateRef<unknown>;

  @ViewChild('defaultUploadItemActionTemplate', { static: true })
  _defaultUploadItemActionTemplate?: TemplateRef<unknown>;

  /**
   * Source to upload selected files to.
   */
  @Input()
  uploadSource?: FileUploadSource;

  @Input()
  statusBar = false;

  constructor(
    private _dialogService: MatDialog,
    private _directionality: Directionality,
    private _fileUploadService: FileUploadService
  ) {
    this._uploadState$ = this._fileUploadService.uploadState$;
  }

  ngAfterContentInit() {
    if (!this._fileInputRef) {
      throw new Error('File input with a FileInputDirective is required');
    }
  }

  /**
   * Reset file upload
   */
  reset() {
    this._fileUploadService.reset();
    if (this._fileInputRef) {
      this._fileInputRef.nativeElement.files = null;
      this._fileInputRef.nativeElement.value = null;
    }
  }

  _onFileChange(files: FileList) {
    // Only add files if an uploadSource has been provided.
    // If no upload source is provided, it is assumed the consumer will handle the upload state.
    if (this.uploadSource) {
      if (!this._fileInputRef.nativeElement.multiple) {
        this._fileUploadService.reset();
      }

      this._fileUploadService.addFiles(files, this.uploadSource);
    }
  }

  _onView() {
    const uploadData: FileUploadDialogData = {
      uploadItems$: this._uploadState$.pipe(
        map((status) => status?.uploadItems ?? []),
        shareReplay()
      ),
      uploadItemActionTemplate:
        this._customUploadItemActionTemplate ??
        this._defaultUploadItemActionTemplate,
    };

    this._dialogService.open(FileUploadDialogComponent, {
      data: uploadData,
      minWidth: 350,
      direction: this._directionality.value,
    });
  }
}

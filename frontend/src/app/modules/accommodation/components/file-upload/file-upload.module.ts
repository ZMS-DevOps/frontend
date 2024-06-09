import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FileUploadStatusBarComponent } from './components/file-upload-status-bar/file-upload-status-bar.component';
import { FileUploadCaptionComponent } from './components/file-upload-caption/file-upload-caption.component';
import { FileUploadDialogComponent } from './components/file-upload-dialog/file-upload-dialog.component';
import { FileUploadItemComponent } from './components/file-upload-item/file-upload-item.component';
import { FileUploadZoneComponent } from './components/file-upload-zone/file-upload-zone.component';
import { FileUploadItemActionDirective } from './directives/file-upload-item-action.directive';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadInputDirective } from './directives/file-input.directive';

@NgModule({
  imports: [
    CommonModule,
    BidiModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  declarations: [
    FileUploadInputDirective,
    FileUploadComponent,
    FileUploadZoneComponent,
    FileUploadItemComponent,
    FileUploadDialogComponent,
    FileUploadCaptionComponent,
    FileUploadStatusBarComponent,
    FileUploadItemActionDirective,
  ],
  exports: [
    FileUploadInputDirective,
    FileUploadComponent,
    FileUploadItemComponent,
    FileUploadCaptionComponent,
    FileUploadItemActionDirective,
  ],
  entryComponents: [FileUploadDialogComponent],
})
export class FileUploadModule {}

import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload-item',
  templateUrl: './file-upload-item.component.html',
  styleUrls: ['./file-upload-item.component.scss'],
})
export class FileUploadItemComponent {
  /**
   * Upload item label
   */
  @Input()
  label?: string;

  /**
   * Decimal value between 0 and 1 representing the uploads progress
   */
  @Input()
  get progress() {
    return this._progress;
  }
  set progress(value: number) {
    this._progress = coerceNumberProperty(value, 0);
  }
  private _progress = 0;

  /**
   * Type of item being uploaded
   */
  @Input()
  fileType?: string;

  /**
   * Upload item error message
   */
  @Input()
  error?: string;
}

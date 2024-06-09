import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload-status-bar',
  templateUrl: './file-upload-status-bar.component.html',
  styleUrls: ['./file-upload-status-bar.component.scss'],
})
export class FileUploadStatusBarComponent {
  @Input()
  uploaded = 0;

  @Input()
  inProgress = 0;

  @Input()
  totalProgress = 0;

  @Input()
  failed = 0;
}

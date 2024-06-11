import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

@Component({
  selector: 'app-file-upload-zone',
  templateUrl: './file-upload-zone.component.html',
  styleUrls: ['./file-upload-zone.component.scss'],
})
export class FileUploadZoneComponent implements OnDestroy {
  private _fileChangeSubscription: Subscription;
  _fileDragDetected = false;

  @Input()
  get fileInputRef() {
    return this._fileInputRef;
  }
  set fileInputRef(value: ElementRef<HTMLInputElement> | undefined) {
    this._fileChangeSubscription?.unsubscribe();
    this._fileInputRef = value;
    this._subscribeToFileChanges();
  }
  private _fileInputRef?: ElementRef<HTMLInputElement>;

  @Output()
  fileChange = new EventEmitter<FileList>();

  @HostListener('dragover', ['$event'])
  _dragOver(event: DragEvent) {
    event.preventDefault();
    this._fileDragDetected = event.dataTransfer?.types.some(
      (dataType) => dataType === 'Files'
    );
  }

  @HostListener('dragleave', ['$event'])
  _dragLeave(event: DragEvent) {
    this._fileDragDetected = false;
  }

  @HostListener('drop', ['$event'])
  _drop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files?.length && this.fileInputRef) {
      this.fileInputRef.nativeElement.files = files;
      const changeEvent = new Event('change');
      this.fileInputRef.nativeElement.dispatchEvent(changeEvent);
    }
    this._fileDragDetected = false;
  }

  ngOnDestroy() {
    this._fileChangeSubscription?.unsubscribe();
  }

  _onBrowse() {
    this.fileInputRef.nativeElement.click();
  }

  private _subscribeToFileChanges() {
    if (this._fileInputRef) {
      this._fileChangeSubscription = fromEvent(
        this._fileInputRef.nativeElement,
        'change'
      ).subscribe(() => {
        if (this._fileInputRef) {
          const files = this._fileInputRef.nativeElement.files;
          this.fileChange.emit(files);
        }
      });
    }
  }
}

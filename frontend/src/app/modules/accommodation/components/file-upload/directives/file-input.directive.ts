import { Directive } from '@angular/core';

@Directive({
  selector: '[appFileUploadInput]input[type="file"]',
  host: {
    '[class.file-upload__input]': 'true',
  },
})
export class FileUploadInputDirective {}

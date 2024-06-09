import { Directive } from '@angular/core';

/**
 * Provides a template to be rendered in the action slot of an upload item.
 *
 * Note: must be used as a structural directive.
 */
@Directive({
  selector: '[appFileUploadItemAction]',
})
export class FileUploadItemActionDirective {}

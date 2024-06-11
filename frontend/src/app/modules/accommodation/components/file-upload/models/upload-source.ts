import { Observable } from 'rxjs';

export interface FileUploadSource {
  upload(file: File, uploadItemId: number): Observable<number>;
  delete?(uploadItemId: number): Observable<unknown>;
}

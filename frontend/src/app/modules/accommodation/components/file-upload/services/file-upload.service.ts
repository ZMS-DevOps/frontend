import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import {
  catchError,
  first,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  takeWhile,
} from 'rxjs/operators';

import { FileUploadItem } from '../models/upload-item';
import { FileUploadSource } from '../models/upload-source';
import { FileUploadState } from '../models/upload-state';

let UPLOAD_ITEM_COUNT = 0;

@Injectable()
export class FileUploadService {
  private _uploadChangeSubject = new Subject<void>();
  private _resetSubject = new Subject<undefined>();
  private _fileUploadItemMap = new Map<number, Observable<FileUploadItem>>();

  /**
   * Upload state
   */
  uploadState$: Observable<FileUploadState>;

  constructor() {
    const uploadStatus$ = this._uploadChangeSubject.pipe(
      switchMap(() =>
        combineLatest(Array.from(this._fileUploadItemMap.values()))
      ),
      map((uploadItems) => {
        const { activeUploads, failedUploads, completeUploads } =
          this._partitionUploads(uploadItems);

        return {
          totalProgress: this._calculateTotalProgress(activeUploads),
          activeUploads,
          failedUploads,
          completeUploads,
          uploadItems,
        };
      }),
      shareReplay()
    );

    this.uploadState$ = merge(uploadStatus$, this._resetSubject);
  }

  /**
   * Add new files and track their upload progress
   */
  addFiles(files: FileList, uploadSource: FileUploadSource) {
    Array.from(files).forEach((file) => {
      const uploadItemId = UPLOAD_ITEM_COUNT++;
      const startFileUploadSubject = new BehaviorSubject<undefined>(undefined);
      const cancelFileUploadSubject = new Subject<void>();

      const partialUploadItem: Omit<FileUploadItem, 'progress'> = {
        id: uploadItemId,
        fileName: file.name,
        fileType: file.type,
        retry: () => {
          // Next startFileUploadSubject to restart the stream
          startFileUploadSubject.next(undefined);
        },
        cancel: () => {
          cancelFileUploadSubject.next();
          cancelFileUploadSubject.complete();
          this.removeFile(uploadItemId);
        },
        delete: () => {
          if (uploadSource?.delete) {
            uploadSource
              ?.delete(uploadItemId)
              .pipe(first())
              .subscribe(() => {
                // If delete is successful, remove the file.
                cancelFileUploadSubject.next();
                cancelFileUploadSubject.complete();
                this.removeFile(uploadItemId);
              });
          } else {
            cancelFileUploadSubject.next();
            cancelFileUploadSubject.complete();
            this.removeFile(uploadItemId);
          }
        },
      };

      // Start the stream with the startFileUploadSubject so that the stream to can be retried.
      const fileUploadItemStream$ = startFileUploadSubject.pipe(
        switchMap(() => {
          // Pass the file off to be uploaded.
          // Include uploadItemId so consumers have a reference to the id we use internally
          // to identify an upload. This is particularly useful when a file should be deleted.
          return uploadSource.upload(file, uploadItemId).pipe(
            startWith(0),
            map((progress) => {
              const uploadItem: FileUploadItem = {
                ...partialUploadItem,
                progress: this._convertToDecimal(progress),
              };
              return uploadItem;
            }),
            // Automatically complete if the progress reaches 100%.
            takeWhile((uploadItem) => uploadItem.progress < 1, true),
            // Complete if the file upload is cancelled or reset.
            takeUntil(merge(cancelFileUploadSubject, this._resetSubject)),
            // Catch errors and return a new FileUploadItem with the error message.
            catchError((error: Error) => {
              console.error(error);
              const errorUploadItem: FileUploadItem = {
                ...partialUploadItem,
                progress: 0,
                error: error.message,
              };
              return of(errorUploadItem);
            })
          );
        }),
        // Share the stream so that new subscriptions are not created with new files are added.
        shareReplay(1)
      );

      // Add the file upload stream
      this._fileUploadItemMap.set(uploadItemId, fileUploadItemStream$);
    });

    // Next _uploadChangeSubject to combine the new streams with the current streams and update state.
    this._uploadChangeSubject.next();
  }

  /**
   * Remove file and stop tracking it's upload progress
   */
  removeFile(uploadItemId: number) {
    this._fileUploadItemMap.delete(uploadItemId);
    this._uploadChangeSubject.next();

    // If the last file upload item is removed, the combineLatest will not fire.
    // Next _resetSubject to clear state.
    if (this._fileUploadItemMap.size === 0) {
      this._resetSubject.next(undefined);
    }
  }

  /**
   * Reset the file upload
   */
  reset() {
    this._fileUploadItemMap.clear();
    this._uploadChangeSubject.next();
    this._resetSubject.next(undefined);
  }

  private _calculateTotalProgress(fileUploadItems: FileUploadItem[]) {
    const total = fileUploadItems.length * 100;
    const totalCompleted = fileUploadItems.reduce((completed, uploadItem) => {
      return completed + (uploadItem.progress / total) * 100;
    }, 0);
    return Math.min(totalCompleted, 1);
  }

  private _partitionUploads(fileUploadItems: FileUploadItem[]) {
    const activeUploads: FileUploadItem[] = [];
    const completeUploads: FileUploadItem[] = [];
    const failedUploads: FileUploadItem[] = [];

    fileUploadItems.forEach((fileUploadItem) => {
      if (!!fileUploadItem.error) {
        failedUploads.push(fileUploadItem);
      } else if (fileUploadItem.progress < 1) {
        activeUploads.push(fileUploadItem);
      } else {
        completeUploads.push(fileUploadItem);
      }
    });

    return {
      activeUploads,
      completeUploads,
      failedUploads,
    };
  }

  private _convertToDecimal(progress: number) {
    return progress <= 1 ? progress : progress / 100;
  }
}

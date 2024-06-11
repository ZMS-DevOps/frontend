import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-event-dialog',
  templateUrl: './show-event-dialog.component.html',
  styleUrls: ['./show-event-dialog.component.css']
})
export class ShowEventDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ShowEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { startDate: Date, endDate: Date }
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}

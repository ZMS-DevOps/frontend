import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-cancel-reservation-dialog',
  templateUrl: './cancel-reservation-dialog.component.html',
  styleUrls: ['./cancel-reservation-dialog.component.css']
})
export class CancelReservationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CancelReservationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reservationDeclineType: string,
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}

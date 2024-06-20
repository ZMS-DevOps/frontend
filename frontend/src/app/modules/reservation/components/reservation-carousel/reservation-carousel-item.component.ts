import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ReservationResponse} from "../../../shared/models/reservation/reservation-response";
import {CancelReservationDialogComponent} from "../cancel-reservation-dialog/cancel-reservation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reservation-carousel-item',
  templateUrl: './reservation-carousel-item.component.html',
  styleUrls: ['./reservation-carousel-item.component.scss']
})
export class ReservationCarouselItemComponent {
  @Input() reservation: ReservationResponse;
  @Input() userIsGuest: boolean;
  @Input() userIsHost: boolean;
  @Input() reservationId!: string;

  @Output() acceptEvent = new EventEmitter<string>();
  @Output() declinedEvent = new EventEmitter<string>();

  constructor(private dialog: MatDialog, private router: Router) {}

  getRedirectUserProfileUrl(user_id: string) {
    return `/booking/auth/view-profile/${user_id}`;
  }

  redirectAccommodationViewUrl(accommodation_id: string) {
    this.router.navigate([`/booking/accommodation/${accommodation_id}`]);
  }

  acceptReservation(reservationId: string) {
    this.acceptEvent.emit(reservationId);
  }

  declineReservation(type: string) {
    const dialogRef = this.dialog.open(CancelReservationDialogComponent,
      {
        data: type,
      });
    dialogRef.afterClosed().subscribe(resp => {
      if (resp){
        this.declinedEvent.emit(type);
      }
    });
  }

  getReservationCardClass(status: number, reservationId: string) {
    let className: string = "";
    if (reservationId === this.reservationId){
      className = "selected-reservation "
    }
    if (status === 0){
      return className + "reservation-card orange-border";
    } else if (status === 1){
      return className + "reservation-card green-border";
    } else if (status === 2){
      return className + "reservation-card red-border";
    }
    return className + "reservation-card";
  }

  getClickOnAccommodationViewText(accommodation_name: string) {
    return `View ${accommodation_name} details`;
  }
}

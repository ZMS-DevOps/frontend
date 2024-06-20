import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, Subscription, tap} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {ReservationResponse} from "../../../shared/models/reservation/reservation-response";
import {BookingService} from "../../../shared/services/booking.service";

@Component({
  selector: 'app-view-reservations',
  templateUrl: './view-reservations.component.html',
  styleUrls: ['./view-reservations.component.css'],
})
export class ViewReservationsComponent implements OnInit, OnDestroy {
  reservationId: string;
  loggedUser: User;
  userIsGuest: boolean;
  userIsHost: boolean;
  reservations: ReservationResponse[] = [];

  authSubscription: Subscription;
  getReservationsSubscription: Subscription;
  searchParam: string;
  tabViewIndex: number = 1;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private bookingService: BookingService,
  ) {
    this.searchParam = "";
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reservationId = params['id'];
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(
        loggedUser => {
          this.loggedUser = loggedUser;
          this.userIsHost = this.authService.isUserHost(loggedUser);
          this.userIsGuest = this.authService.isUserGuest(loggedUser);
          this.getReservationsByUser(loggedUser.sub, this.authService.isUserHost(loggedUser)? "host": "guest", false);
          this.putSelectedReservationOnTop();
        });
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.getReservationsSubscription) {
      this.getReservationsSubscription.unsubscribe();
    }
  }

  private getReservationsByUser(userId: string, userType: string, pastReservation: boolean) {
    this.getReservationsSubscription = this.bookingService.getReservationsByUser(userId, userType, pastReservation, this.searchParam).pipe(
      tap(res => {
        this.reservations = res;
        this.putSelectedReservationOnTop();

      }),
      catchError(error => {
        this.toast.error(error.error, 'Getting reservations failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during getting reservations:', error)
    });
  }

  search() {
    this.getReservationsByUser(this.loggedUser.sub, this.authService.isUserHost(this.loggedUser)? "host": "guest", this.tabViewIndex === 0);
  }

  onAcceptReservation(reservationId: string) {
    this.bookingService.approveReservationRequest(reservationId).subscribe({
      next: res => {
        this.toast.success(`Successfully approve reservation request!`, 'Success');
        const reservationIndex = this.reservations.findIndex(reservation => reservation.id === reservationId);
        this.reservations.at(reservationIndex).status = 1;
      },
      error: err => {
        this.toast.error(err.error, 'Reservation request not approve');
      }
    })
  }

  onDeclineReservation(type: string, reservationId: string) {
    if (type === "decline"){
      this.declinePendingReservationRequest(reservationId);
    } else {
      this.declineReservationByGuest(reservationId);
    }
  }

  onTabChange(index: number) {
    this.reservations = [];
    this.searchParam = "";
    this.tabViewIndex = index;
    this.getReservationsByUser(this.loggedUser.sub, this.userIsHost ? "host": "guest", index === 0);
  }

  private putSelectedReservationOnTop() {
    if (this.reservations){
      let index = this.reservations.findIndex(reservation => reservation.id === this.reservationId);

      if (index !== -1) {
        let reservation = this.reservations.splice(index, 1)[0];
        this.reservations.unshift(reservation);
      }
    }
  }

  private declinePendingReservationRequest(reservationId: string) {
    this.bookingService.declineReservationRequest(reservationId).subscribe({
      next: res => {
        this.toast.success(`Successfully declined reservation request!`, 'Success');
        const reservationIndex = this.reservations.findIndex(reservation => reservation.id === reservationId);
        this.reservations.at(reservationIndex).status = 2;
      },
      error: err => {
        this.toast.error(err.error, 'Reservation request not declined');
      }
    })
  }

  private declineReservationByGuest(reservationId: string) {
    this.bookingService.declineAcceptedReservationByGuest(reservationId).subscribe({
      next: res => {
        this.toast.success(`Successfully declined reservation!`, 'Success');
        const reservationIndex = this.reservations.findIndex(reservation => reservation.id === reservationId);
        this.reservations.at(reservationIndex).status = 2;
      },
      error: err => {
        this.toast.error(err.error, 'Reservation not declined');
      }
    })
  }
}

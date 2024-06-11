import {Component, OnDestroy} from '@angular/core';
import {catchError, Subscription, tap} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {AccommodationResponse} from "../../../shared/models/accommodation/accommodation-response";
import {AccommodationService} from "../../services/accommodation.service";
import {ReviewReportResponse} from "../../../shared/models/review-report-response";
import {GradeService} from "../../../auth/services/grade.service";
import {FormControl, FormGroup} from "@angular/forms";
import {EndDate, StartDate} from "ngx-daterangepicker-material/daterangepicker.component";
import dayjs from "dayjs";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {DeleteDialogComponent} from "../../../shared/components/delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";

import {AccommodationRequest} from "../../../shared/models/accommodation/accommodation-request";
import moment from "moment";
import {DisableDatesResponse} from "../../../shared/models/disable-dates-response";
import {BookingService} from "../../../shared/services/booking.service";
import {AddReservationRequest} from "../../../shared/models/reservation/add-reservation-request";

@Component({
  selector: 'app-accommodation-view',
  templateUrl: './view-accommodation.component.html',
  styleUrls: ['./view-accommodation.component.css'],
})
export class ViewAccommodationComponent implements OnDestroy {
  accommodationId: string;
  loggedUser: User;
  userIsHost: boolean;
  userIsGuest: boolean;
  accommodation: AccommodationResponse;
  reviewReportResponse: ReviewReportResponse;
  selected: {start: Date, end: Date};
  authSubscription: Subscription;
  getReviewsSubscription: Subscription;
  updateAccommodationSubscription: Subscription;
  bookAccommodationForm: FormGroup;
  totalPrice: number = 0;
  bookingViewOpened= false;

  groupedPhotos = [];
  selectedIndex = 0;

  disableDates: DisableDatesResponse[];

  constructor(
    private authService: AuthService,
    private accommodationService: AccommodationService,
    private bookingService: BookingService,
    private gradeService: GradeService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.selected = {
      start: null,
      end: null
    }
    this.subscribeToGetCurrentLoggedUser();
    this.bookAccommodationForm = this.getEmptyForm();
    this.route.params.subscribe(params => {
      this.accommodationId = params['id'];
      this.getAccommodation(params['id']);
      this.getDisableDatesForAccommodation(params['id']);
      this.getReviews(params['id']);
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.getReviewsSubscription) {
      this.getReviewsSubscription.unsubscribe();
    }
    if (this.updateAccommodationSubscription){
      this.updateAccommodationSubscription.unsubscribe();
    }
  }

  private getAccommodation(id: string) {
    this.accommodationService.getAccommodationById(id).subscribe(
      accommodation => {
        this.accommodation = accommodation;
        this.groupPhotos();
      }
    )
  }

  groupPhotos() {
    const photos = this.accommodation.photos;
    for (let i = 0; i < photos.length; i += 3) {
      this.groupedPhotos.push(photos.slice(i, i + 3));
    }
  }

  private getReviews(accommodationId: string) {
    this.getReviewsSubscription = this.gradeService.getAllReviewsBySubReviewed(accommodationId, 1).pipe(
      tap(res => {
        this.reviewReportResponse = res;
      }),
      catchError(error => {
        this.toast.error(error.error, 'Getting reviews failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during getting reviews:', error)
    });
  }

  getRouteOfHostProfile() {
    return `/booking/auth/view-profile/${this.accommodation.host_id}`;
  }

  private getEmptyForm() {
    return new FormGroup({
      numberOfGuests: new FormControl(1),
    });
  }

  cancelBooking() {
    this.totalPrice = 0;
    this.bookAccommodationForm.get("numberOfGuests").setValue(1);
  }

  book() {
    const reservationRequest: AddReservationRequest = {
      accommodation_id: this.accommodationId,
      accommodation_name: this.accommodation.name,
      host_id: this.accommodation.host_id,
      user_id: this.loggedUser.sub,
      start: this.selected.start,
      end: this.selected.end,
      number_of_guests: this.bookAccommodationForm.get('numberOfGuests').value,
      price_total: this.totalPrice,
    }
    this.getReviewsSubscription = this.bookingService.createReservationRequest(reservationRequest).pipe(
      tap(_ => {
        this.toast.success('Your successfully create new reservation request.', 'Success!');
      }),
      catchError(error => {
        this.toast.error(error.error, 'Creating new reservation request failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during creating new reservation request:', error)
    });
  }

  canBookAccommodation() {

    return this.bookAccommodationForm.get("numberOfGuests").value > 0 && this.selected.start && this.selected.end;
  }

  getGuestsValue() {
    return this.bookAccommodationForm.get("numberOfGuests").value
  }

  onStartDateChanged(startDate: StartDate) {
    this.selected.start = dayjs(startDate.startDate).toDate();
    this.totalPrice = this.calculateTotalPrice();
  }

  onEndDateChanged(endDate: EndDate) {
    const tempDate = dayjs(endDate.endDate).toDate();
    tempDate.setDate(tempDate.getDate()-1);
    this.selected.end = tempDate;
    this.totalPrice = this.calculateTotalPrice();
  }

  onTabChange($event: MatTabChangeEvent) {
    switch ($event.index){
      case 2:
        this.showCalendar();
        break;
      case 3:
        this.openDeleteAccommodationDialog();
        this.selectedIndex = 0;
        break;
      default:
        this.bookingViewOpened = $event.index === 1;
        this.selectedIndex = $event.index;
    }
  }

  showCalendar() {
    this.router.navigate(
      [`/booking/reservation/calendar/${this.accommodationId}`],
      { queryParams: { accommodationName: this.accommodation.name, } }
    );
  }

  openDeleteAccommodationDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: "accommodation",
    });
    dialogRef.afterClosed().subscribe(resp => {
      if (resp){
        this.deleteAccommodation();
      }
    });
  }

  onUpdateAccommodation(updatedAccommodation: FormData) {
    // onUpdateAccommodation(updatedAccommodation: AccommodationRequest) {
    this.updateAccommodationSubscription = this.accommodationService.updateAccommodation(this.accommodation.id, updatedAccommodation).pipe(
      tap(res => {
        this.toast.success('Your accommodation is updated successfully.', 'Success!');
      }),
      catchError(error => {
        this.toast.error(error.error, 'Updating accommodation failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during updating accommodation:', error)
    });
  }

  private deleteAccommodation() {
    this.getReviewsSubscription = this.accommodationService.delete(this.accommodationId).pipe(
      tap(_ => {
        this.toast.success('Your accommodation is deleted successfully.', 'Success!');
      }),
      catchError(error => {
        this.toast.error(error.error, 'Delete accommodation failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during deleting accommodation:', error)
    });
  }

  private subscribeToGetCurrentLoggedUser() {
    this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
      this.loggedUser = loggedUser;
      this.userIsHost = this.authService.isUserHost(loggedUser);
      this.userIsGuest = this.authService.isUserGuest(loggedUser);
    });
  }

  private getDisableDatesForAccommodation(accommodationId: string) {
    this.getReviewsSubscription = this.bookingService.getDisableDates(accommodationId).pipe(
      tap(res => {
        this.disableDates = res;
      }),
    ).subscribe({
      error: error => console.error('Error during getting accommodation unavailable booking dates:', error)
    });
  }

  private calculateTotalPrice() {
    let totalPrice = 0;

    const startDate = new Date(this.selected.start);
    const endDate = new Date(this.selected.end);

    const days = Math.ceil(moment(endDate).diff(startDate, 'days', true)) +1

    for (let i = 0; i < days; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      let dailyPrice = this.accommodation.default_price.price;

      for (let special of this.accommodation.special_price) {
        const specialStartDate = new Date(special.date_range.start);
        const specialEndDate = new Date(special.date_range.end);

        if (moment(currentDate).isBetween(specialStartDate, specialEndDate, 'day', '[]')){
          dailyPrice = special.price;
          break;
        }
      }

      if (this.accommodation.default_price.type === "PerGuest") {
        dailyPrice *= this.bookAccommodationForm.get("numberOfGuests").value;
      }
      totalPrice += dailyPrice;
    }

    return totalPrice;
  }

  getTextPriceType() {
    return this.accommodation.default_price.type === "PerGuest" ? "person": "apartment unit";
  }

  onGuestNumberChanged() {
    this.totalPrice = this.calculateTotalPrice();
  }
}

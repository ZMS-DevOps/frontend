import {Component, Input, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {HotelCardResponse} from "../../models/hotel-card-response";
import {User} from "../../models/user/user";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {catchError, Subscription, tap} from "rxjs";
import {AccommodationService} from "../../../accommodation/services/accommodation.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-accommodation-card',
    templateUrl: './accommodation-card.component.html',
    styleUrls: ['./accommodation-card.component.scss']
})
export class AccommodationCardComponent implements OnDestroy{

  @Input() hotel: any;
  // @Input() hotel: HotelCardResponse;
  @Input() loggedUser: User;
  deleteAccommodationSubscription: Subscription;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private accommodationService: AccommodationService,
    private toast: ToastrService,
  ) {
    console.log(this.hotel);
  }

  ngOnDestroy(): void {
    if (this.deleteAccommodationSubscription){
      this.deleteAccommodationSubscription.unsubscribe();
    }
  }

  redirectToAccommodationDetails() {
    this.router.navigate([`/booking/accommodation/${this.hotel.id}`])
  }

  getPhotoUrl(hotel: any): string {
    if (hotel.photos && hotel.photos.size > 0){
      return `data:image/jpeg;base64,${hotel.photos[0]}`;
    } else {
      return "assets/images/" + hotel.main_photo;
    }
  }

  getPriceTypeText(priceType: string) {
    return priceType === "PerGuest" ? "per person" : "per apartment unit";
  }

  getDetailsTooltipText() {
    return this.loggedUser? "See accommodation details": "Login to see accommodation details";
  }

  isUserHost() {
    return this.loggedUser?.roles?.some(role => role.toLowerCase() === "host");
  }

  isUserGuest() {
    return this.loggedUser?.roles?.some(role => role.toLowerCase() === "guest");
  }

  onDeleteAccommodation() {
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: "user",
      });
    dialogRef.afterClosed().subscribe(resp => {
      if (resp){
        this.deleteAccommodation()
      }
    });
  }

  private deleteAccommodation() {
    this.deleteAccommodationSubscription = this.accommodationService.delete(this.hotel.id).pipe(
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
}

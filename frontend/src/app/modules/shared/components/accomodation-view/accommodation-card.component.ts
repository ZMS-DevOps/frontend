import {Component, Input, OnDestroy} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../../models/user/user";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {catchError, Subscription, tap} from "rxjs";
import {AccommodationService} from "../../../accommodation/services/accommodation.service";
import {ToastrService} from "ngx-toastr";
import {ImageResponse} from "../../models/accommodation/image-response";

@Component({
    selector: 'app-accommodation-card',
    templateUrl: './accommodation-card.component.html',
    styleUrls: ['./accommodation-card.component.scss']
})
export class AccommodationCardComponent implements OnDestroy{
  @Input() hotel: any;
  @Input() loggedUser: User;
  deleteAccommodationSubscription: Subscription;
  @Input() images: ImageResponse;
  @Input() showTotalPrice!: boolean;

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

  getPhotoUrl(): string {
    if (this.images?.images && this.images?.images.length > 0){
      return `data:image/jpeg;base64,${this.images.images[0]}`;
    } else {
      return "assets/images/menuet.jpg";
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
        data: "accommodation",
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

  checkIfAccommodationCanBeDeleted() {
    return this.isUserHost() && this.loggedUser.sub === this.hotel.host_id;
  }
}

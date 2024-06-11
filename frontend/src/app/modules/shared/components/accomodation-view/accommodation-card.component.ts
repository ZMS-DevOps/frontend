import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {HotelCardResponse} from "../../models/hotel-card-response";

@Component({
    selector: 'app-accommodation-card',
    templateUrl: './accommodation-card.component.html',
    styleUrls: ['./accommodation-card.component.scss']
})
export class AccommodationCardComponent {

  @Input() hotel: any;
  // @Input() hotel: HotelCardResponse;
  
  constructor(private router: Router) {
    console.log(this.hotel);
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
}

import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {HotelCardResponse} from "../../models/hotel-card-response";

@Component({
    selector: 'app-accommodation-card',
    templateUrl: './accommodation-card.component.html',
    styleUrls: ['./accommodation-card.component.scss']
})
export class AccommodationCardComponent {

  @Input() hotel: HotelCardResponse;

  constructor(private router: Router) {}

  redirectToAccommodationDetails() {
    this.router.navigate([`/booking/accommodation/${this.hotel.id}`])
  }

  getPriceTypeText(priceType: string) {
    return priceType === "PerGuest" ? "per person" : "per apartment unit";
  }
}

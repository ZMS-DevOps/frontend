import {FormGroup} from "@angular/forms";

export interface AccommodationRequest {
  host_id: string;
  name: string;
  location: string;
  benefits: string[];
  guest_number: {
    min: number,
    max: number,
  }
  photos: string[];
  default_price: {
    price: number;
    type: string;
  },
  review_reservation_request_automatically: boolean
}

export function toAccommodationRequest(form: FormGroup, userId: string, changedPrice: boolean, defaultPrice?: number, priceType?: string): AccommodationRequest {

  return {
    host_id: userId,
    name: form.get("name").value,
    location: form.get("location").value,
    benefits: form.get("benefits").value,
    guest_number: {
      min: form.get("minGuests").value,
      max: form.get("maxGuests").value,
    },
    photos: form.get("photos").value,
    default_price: {
      price: changedPrice ? form.get("price").value: defaultPrice,
      type: changedPrice ? form.get("priceType").value: priceType
    },
    review_reservation_request_automatically: form.get("reviewReservationRequestAutomatically").value
  }
}

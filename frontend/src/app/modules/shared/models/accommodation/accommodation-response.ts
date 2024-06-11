export interface AccommodationResponse {
  id: string;
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
  };
  special_price: SpecialPrice[];
  review_reservation_request_automatically: boolean;
}

export interface SpecialPrice {
  price: number;
  date_range: {
    start: Date;
    end: Date;
  }
}

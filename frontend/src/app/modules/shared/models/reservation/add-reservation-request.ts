export interface AddReservationRequest {
  accommodation_id: string;
  accommodation_name: string;
  host_id: string;
  user_id: string;
  start: Date;
  end: Date;
  number_of_guests: number;
  price_total: number;
}

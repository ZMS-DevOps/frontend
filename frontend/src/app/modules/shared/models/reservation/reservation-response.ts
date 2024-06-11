export interface ReservationResponse {
  id: string;
  accommodation_id: string;
  accommodation_name: string;
  user_id: string;
  start: Date;
  end: Date;
  number_of_guests: number;
  price_total: number;
  status: number;
  number_of_canceled_reservations: number;
}

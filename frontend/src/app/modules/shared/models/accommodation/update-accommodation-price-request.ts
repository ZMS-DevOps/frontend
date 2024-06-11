export interface UpdateAccommodationPriceRequest {
  date_range: {
    start: Date,
    end: Date,
  },
  price: number,
  type: string,
}

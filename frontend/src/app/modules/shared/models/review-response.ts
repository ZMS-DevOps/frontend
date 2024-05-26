export interface ReviewResponse {
  totalReviews: number;
  averageRating: number;
  numberOfStars:
    {
      label: string;
      value: number;
    }[];
  reviews: SingleReview[];
}

export interface SingleReview {
  id: string;
  comment: string;
  grade: number;
  subReviewer: string;
  fullName: string;
  dateOfCreation: Date
}

export interface ReviewRequest {
  comment: string;
  grade: number;
  subReviewer: string;
  subReviewed: string;
  reviewerFullName: string;
  reviewType: number;
}

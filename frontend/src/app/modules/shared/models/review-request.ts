import {User} from "./user/user";

export interface ReviewRequest {
  comment: string;
  grade: number;
  subReviewer: string;
  subReviewed: string;
  reviewerFullName: string;
  reviewType: number;
  hostId: string;
}

export function toReviewRequest(userId: string, loggedUser: User, grade: number, comment: string, reviewType: number, hostId: string): ReviewRequest {
  return {
    comment: comment,
    grade: grade,
    subReviewer: loggedUser.sub,
    subReviewed: userId,
    reviewerFullName: `${loggedUser.given_name} ${loggedUser.family_name}`,
    reviewType: reviewType,
    hostId: hostId,
  }
}

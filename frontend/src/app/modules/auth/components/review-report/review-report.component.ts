import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReviewReportResponse, SingleReview, UpdateSingleReview} from "../../../shared/models/review-report-response";
import {User} from "../../../shared/models/user/user";
import {catchError, Subscription, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {GradeService} from "../../services/grade.service";
import {ReviewRequest} from "../../../shared/models/review-request";
import {UpdateReviewRequest} from "../../../shared/models/update-review-request";
import {NgxStarsComponent} from "ngx-stars";

@Component({
  selector: 'app-review-report',
  templateUrl: './review-report.component.html',
  styleUrls: ['./review-report.component.scss']
})
export class ReviewReportComponent implements OnInit, OnDestroy {
  @ViewChild(NgxStarsComponent) ratingComponent: NgxStarsComponent;
  @Input() reviewReportResponse: ReviewReportResponse;
  @Input() loggedUser: User;
  @Input() userId: string;

  maxRating: number;
  deleteReviewSubscription: Subscription;
  updateReviewSubscription: Subscription;
  addReviewSubscription: Subscription;

  constructor(private toast: ToastrService, private gradeService: GradeService) {
  }

  ngOnInit(): void {
    this.maxRating = Math.max(...this.reviewReportResponse?.numberOfStars.map(r => r.value))
  }

  ngOnDestroy(): void {
    if (this.deleteReviewSubscription){
      this.deleteReviewSubscription.unsubscribe()
    }
    if (this.updateReviewSubscription){
      this.updateReviewSubscription.unsubscribe()
    }
    if (this.addReviewSubscription){
      this.addReviewSubscription.unsubscribe()
    }
  }

  getTotalReviewsNumber() {
    return this.reviewReportResponse?.totalReviews > 0 ?
      this.reviewReportResponse.totalReviews : 0;
  }

  getAverageRating() {
    return this.reviewReportResponse?.averageRating > 0 ?
      this.reviewReportResponse.averageRating : 0;
  }

  getNgStyle(label: string) {
    if (label === '5'){
      return {'background-color': '#d3f1d9', 'color': '#3bda5c'}
    } else if (label === '4') {
      return {'background-color': '#f4dbf0', 'color': '#ea67db'}
    } else if (label === '3') {
      return {'background-color': '#fff4d8', 'color': '#ffb400'}
    } else if (label === '2') {
      return {'background-color': '#d7e9f3', 'color': '#5bb5e9'}
    }
    return {'background-color': '#f4dac9', 'color': '#f27010'}
  }

  addReview(review: { grade: number; comment: string; }) {
    const reviewRequest: ReviewRequest = {
      comment: review.comment,
      grade: review.grade,
      subReviewer: this.loggedUser.sub,
      subReviewed: this.userId,
      reviewerFullName: `${this.loggedUser.given_name} ${this.loggedUser.family_name}`,
      reviewType: 0,
    }
    this.addReviewSubscription = this.gradeService.addReview(reviewRequest).pipe(
      tap(res => {
        this.reviewReportResponse.reviews.push(res);
        this.reviewReportResponse.averageRating = this.getNewAveragingRating(this.reviewReportResponse.averageRating, this.reviewReportResponse.totalReviews, review.grade, "ADD");
        this.reviewReportResponse.totalReviews = this.reviewReportResponse.totalReviews + 1;
        this.setAverageRatingStars(this.reviewReportResponse.averageRating);
        this.toast.success("Review added")
      }),
      catchError(error => {
        this.toast.error(error.error, 'Adding review failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during adding review:', error)
    });
  }

  onDeleteReview(reviewId: string, grade: number) {
    console.log("DELETING REVIEW WITH ID " + reviewId)
    this.deleteReview(reviewId, grade);
  }

  onUpdateReview(singleReview: UpdateSingleReview) {
    this.updateReview(singleReview);
  }

  private deleteReview(reviewId: string, grade: number) {
    this.deleteReviewSubscription = this.gradeService.deleteReview(reviewId).pipe(
      tap(_ => {
        this.setChangedFields(
          this.reviewReportResponse.reviews.filter(review => review.id !== reviewId),
          this.getNewAveragingRating(this.reviewReportResponse.averageRating, this.reviewReportResponse.totalReviews, grade, "MINUS"),
          this.reviewReportResponse.totalReviews - 1,
        );
        this.setAverageRatingStars(this.reviewReportResponse.averageRating);
        this.toast.success("Review deleted");
      }),
      catchError(error => {
        this.toast.error(error.error, 'Deleting review failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during deleting review:', error)
    });
  }

  private updateReview(singleReview: UpdateSingleReview) {
    const updateReviewRequest: UpdateReviewRequest = {
      comment: singleReview.comment,
      grade: singleReview.grade,
      reviewType: 0,
    }
    this.updateReviewSubscription = this.gradeService.updateReview(singleReview.id, updateReviewRequest).pipe(
      tap(_ => {
        this.reviewReportResponse.reviews.forEach(review => {
          if (review.id === singleReview.id) {
            review.grade = singleReview.grade;
            review.comment = singleReview.comment;
            review.dateOfModification = new Date();
          }
        });
        this.reviewReportResponse.averageRating = this.getNewAveragingRating(this.reviewReportResponse.averageRating, this.reviewReportResponse.totalReviews, singleReview.oldGrade, "UPDATE", singleReview.grade);
        this.setAverageRatingStars(this.reviewReportResponse.averageRating);
        this.toast.success("Review updated")
      }),
      catchError(error => {
        this.toast.error(error.error, 'Updating review failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during updating review:', error)
    });
  }

  private getNewAveragingRating(averageRating: number, numberOfReviews: number, grade: number, op: string, updatedGrade?: number) {
    if (numberOfReviews === 0){
      if (op === "ADD") return grade;
      if (op === "UPDATE") return grade;
      if (op === "MINUS") return 0;
    } else {
      if (op === "MINUS"){
        return (averageRating*numberOfReviews - grade) / (numberOfReviews - 1)
      }
      if (op === "ADD"){
        return (averageRating*numberOfReviews + grade) / (numberOfReviews + 1)
      }
      if (op === "UPDATE"){
        return (averageRating*numberOfReviews - grade + updatedGrade)/numberOfReviews
      }
    }
    return 0;
  }

  private setChangedFields(singleReviews: SingleReview[], newAveragingRating: number, totalReviews: number) {
    this.reviewReportResponse.reviews = singleReviews;
    this.reviewReportResponse.averageRating = newAveragingRating;
    this.reviewReportResponse.totalReviews = totalReviews;
  }

  private setAverageRatingStars(rating: number) {
    this.ratingComponent.readonly = false
    this.ratingComponent.setRating(rating);
    this.ratingComponent.rating = rating;
    this.ratingComponent.readonly = true
  }
}

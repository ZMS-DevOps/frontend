import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ReviewReportResponse, SingleReview, UpdateSingleReview} from "../../../shared/models/review-report-response";
import {User} from "../../../shared/models/user/user";
import {catchError, Subscription, tap} from "rxjs";
import {ToastrService} from "ngx-toastr";
import {GradeService} from "../../services/grade.service";
import {toReviewRequest} from "../../../shared/models/review-request";
import {UpdateReviewRequest} from "../../../shared/models/update-review-request";
import {NgxStarsComponent} from "ngx-stars";
import {ADD, MINUS, UPDATE} from "./constants";

@Component({
  selector: 'app-review-report',
  templateUrl: './review-report.component.html',
  styleUrls: ['./review-report.component.scss']
})
export class ReviewReportComponent implements OnInit, OnDestroy {
  @ViewChild(NgxStarsComponent) ratingComponent: NgxStarsComponent;
  @Input() reviewReportResponse: ReviewReportResponse;
  @Input() loggedUser: User;
  @Input() userIsGuest!: boolean;
  @Input() userId!: string;
  @Input() accommodationId!: string;
  @Input() reviewType: number;
  @Input() hostId: string;
  maxRating: number;
  deleteReviewSubscription: Subscription;
  updateReviewSubscription: Subscription;
  addReviewSubscription: Subscription;

  constructor(
    private toast: ToastrService,
    private gradeService: GradeService,
  ) {}

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
    this.addReviewSubscription = this.gradeService.addReview(toReviewRequest(this.userId ? this.userId : this.accommodationId, this.loggedUser, review.grade, review.comment, this.reviewType, this.hostId)).pipe(
      tap(res => {
        this.changeFieldsAfterSuccessReviewAdd(res);
      }),
      catchError(error => {
        this.toast.error("You don't have finished reservations yet.", 'Adding review failed');
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
    this.deleteReviewSubscription = this.gradeService.deleteReview(reviewId, this.reviewType).pipe(
      tap(_ => {
        this.changeFieldsAfterSuccessReviewDelete(reviewId, grade);
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
      reviewType: this.reviewType,
    }
    this.updateReviewSubscription = this.gradeService.updateReview(singleReview.id, updateReviewRequest).pipe(
      tap(_ => {
        this.changeFieldsAfterSuccessReviewUpdate(singleReview);
      }),
      catchError(error => {
        this.toast.error(error.error, 'Updating review failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during updating review:', error)
    });
  }

  private changeFieldsAfterSuccessReviewAdd(res: SingleReview) {
    this.reviewReportResponse.reviews.push(res);
    this.reviewReportResponse.averageRating = this.getNewAveragingRating(this.reviewReportResponse.averageRating, this.reviewReportResponse.totalReviews, res.grade, ADD);
    this.reviewReportResponse.totalReviews = this.reviewReportResponse.totalReviews + 1;
    this.setAverageRatingStars(this.reviewReportResponse.averageRating);
    this.toast.success("Review added")
  }

  private changeFieldsAfterSuccessReviewDelete(reviewId: string, grade: number) {
    this.reviewReportResponse.reviews = this.reviewReportResponse.reviews.filter(review => review.id !== reviewId);
    this.reviewReportResponse.averageRating = this.getNewAveragingRating(this.reviewReportResponse.averageRating, this.reviewReportResponse.totalReviews, grade, MINUS);
    this.reviewReportResponse.totalReviews = this.reviewReportResponse.totalReviews - 1;
    this.setAverageRatingStars(this.reviewReportResponse.averageRating);
    this.toast.success("Review deleted");
  }

  private changeFieldsAfterSuccessReviewUpdate(singleReview: UpdateSingleReview) {
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
  }

  private getNewAveragingRating(averageRating: number, numberOfReviews: number, grade: number, op: string, updatedGrade?: number) {
    if (numberOfReviews === 0) {
      return op === MINUS ? 0 : grade;
    }
    return this.calculateNewAveragingRating(op, averageRating, numberOfReviews, grade, updatedGrade)
  }

  private calculateNewAveragingRating(op: string, averageRating: number, numberOfReviews: number, grade: number, updatedGrade?: number): number {
    switch (op) {
      case ADD:
        return this.calculateNewRatingForAdd(averageRating, numberOfReviews, grade);
      case MINUS:
        return this.calculateNewRatingForMinus(averageRating, numberOfReviews, grade);
      case UPDATE:
        if (updatedGrade !== undefined) {
          return this.calculateNewRatingForUpdate(averageRating, numberOfReviews, grade, updatedGrade);
        }
        break;
    }

    return 0;
  }

  private calculateNewRatingForAdd(
    averageRating: number,
    numberOfReviews: number,
    grade: number
  ): number {
    return (averageRating * numberOfReviews + grade) / (numberOfReviews + 1);
  }

  private calculateNewRatingForMinus(
    averageRating: number,
    numberOfReviews: number,
    grade: number
  ): number {
    if (numberOfReviews === 1) return 0;
    return (averageRating * numberOfReviews - grade) / (numberOfReviews - 1);
  }

  private calculateNewRatingForUpdate(
    averageRating: number,
    numberOfReviews: number,
    grade: number,
    updatedGrade: number
  ): number {
    return (averageRating * numberOfReviews - grade + updatedGrade) / numberOfReviews;
  }

  private setAverageRatingStars(rating: number) {
    this.ratingComponent.readonly = false
    this.ratingComponent.setRating(rating);
    this.ratingComponent.rating = rating;
    this.ratingComponent.readonly = true
  }
}

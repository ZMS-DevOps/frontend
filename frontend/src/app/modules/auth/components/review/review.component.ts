import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DeleteDialogComponent} from "../../../shared/components/delete-dialog/delete-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {SingleReview, UpdateSingleReview} from "../../../shared/models/review-report-response";
import {NgxStarsComponent} from "ngx-stars";

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss'],
})
export class ReviewComponent implements OnInit{
  @ViewChild('commentTextarea') commentTextarea: ElementRef;
  @ViewChild(NgxStarsComponent) ratingComponent: NgxStarsComponent;
  @Input() review: SingleReview;
  @Input() loggedUserId: string;
  @Input() userIsGuest!: boolean;
  @Output() deletingReviewEvent = new EventEmitter<null>();
  @Output() updatingReviewEvent = new EventEmitter<UpdateSingleReview>();
  reviewFormGroup: FormGroup;
  readOnly = true;
  updatingGrade: number;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.reviewFormGroup = this.getEmptyForm(this.review);
    this.updatingGrade = this.review?.grade;
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: "review",
    });
    dialogRef.afterClosed().subscribe(resp => {
      if (resp){
        this.deletingReviewEvent.emit(resp);
      }
    });
  }

  editReview() {
    this.readOnly = false;
    setTimeout(() => {
      this.commentTextarea.nativeElement.focus();
    }, 0);
  }

  private getEmptyForm(review: {
    id: string;
    comment: string;
    grade: number;
    subReviewer: string;
    fullName: string;
    dateOfModification: Date
  }) {
    return new FormGroup({
      comment: new FormControl(review.comment, [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  cancelEditing() {
    this.ratingComponent.setRating(this.review.grade);
    this.updatingGrade = this.review.grade;
    this.reviewFormGroup.get('comment').setValue(this.review.comment);
    this.readOnly = true;
  }

  saveChangedReview() {
    const updateReview: UpdateSingleReview = {
      id: this.review.id,
      comment: this.reviewFormGroup.get('comment').value,
      grade: this.updatingGrade,
      oldGrade: this.review.grade,
    }
    this.updatingReviewEvent.emit(updateReview);
    this.readOnly = true;
  }

  onRatingSet(rate: number) {
    this.updatingGrade = rate;
  }

  cannotSaveUpdatedReview() {
    return this.review.grade === this.updatingGrade && this.reviewFormGroup.get('comment').value === this.review.comment
  }
}

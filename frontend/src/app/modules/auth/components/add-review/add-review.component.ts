import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatAccordion} from "@angular/material/expansion";

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent {
  @Output() submitReviewEvent = new EventEmitter<{ grade: number; comment: string; }>();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  rating: number = 0;
  disabled = true;
  comment: string;

  onRatingSet(rate: number) {
    this.rating = rate;
    this.disabled = false;
    this.accordion.openAll();
  }

  cancelWritingReview() {
    this.rating = 0;
    this.comment = '';
    this.accordion.closeAll();
    this.disabled = true;
  }

  submitReview() {
    this.submitReviewEvent.emit({
      grade: this.rating,
      comment: this.comment
    });
    this.rating = 0;
    this.comment = '';
    this.accordion.closeAll();
    this.disabled = true;
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {AccommodationResponse} from "../../../shared/models/accommodation/accommodation-response";
import {ReviewReportResponse} from "../../../shared/models/review-report-response";
import {User} from "../../../shared/models/user/user";
import {ACCOMMODATION_BENEFITS} from "./constants";

@Component({
    selector: 'app-accommodation-details',
    templateUrl: './accommodation-details.component.html',
    styleUrls: ['./accommodation-details.component.scss']
})
export class AccommodationDetailsComponent implements OnInit {
  @Input() accommodation: AccommodationResponse;
  @Input() reviewReportResponse: ReviewReportResponse;
  @Input() loggedUser: User;
  @Input() userIsGuest: boolean;

  groupedBenefits: string[][] = [];

  ngOnInit(): void {
    this.groupBenefitsInPairs();
  }

  getIcon(labelName: string) {
    const benefit = ACCOMMODATION_BENEFITS.find(benefit => benefit.name === labelName)

    return benefit ? benefit.icon : "check_circle";
  }

  private groupBenefitsInPairs() {
    const benefits = this.accommodation.benefits;

    for (let i = 0; i < benefits.length; i += 3) {
      this.groupedBenefits.push([benefits.at(i), benefits.at(i+1), benefits.at(i+2)]);
    }
  }
}

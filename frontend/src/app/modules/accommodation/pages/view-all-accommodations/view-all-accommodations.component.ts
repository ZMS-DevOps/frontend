import {Component, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {AccommodationService} from "../../services/accommodation.service";
import {HotelCardResponse} from "../../../shared/models/hotel-card-response";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-all-accommodations-view',
  templateUrl: './view-all-accommodations.component.html',
  styleUrls: ['./view-all-accommodations.component.css'],
})
export class ViewAllAccommodationsComponent implements OnDestroy {
  loggedUser: User;
  userId: string;
  userIsGuest: boolean;
  accommodations: HotelCardResponse[];

  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private accommodationService: AccommodationService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.userId = params['id']
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
        this.loggedUser = loggedUser;
        this.userIsGuest = this.authService.isUserGuest(loggedUser);
        this.getAccommodations(params['id']? params['id']: loggedUser.sub)
      });
    });
  }
  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private getAccommodations(userId: string) {
    console.log("ca");
    console.log(userId);
    this.accommodationService.getAccommodationsByUserId(userId).subscribe(
      accommodations => {
        this.accommodations = accommodations;
      }
    )
  }
}

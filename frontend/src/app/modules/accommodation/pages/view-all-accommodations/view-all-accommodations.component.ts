import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {AccommodationService} from "../../services/accommodation.service";
import {HotelCardResponse} from "../../../shared/models/hotel-card-response";
import {ActivatedRoute} from "@angular/router";
import { SearchService } from 'src/app/modules/auth/services/search.service';
import {GetImagesRequest} from "../../../shared/models/accommodation/get-images-request";
import {ImageResponse} from "../../../shared/models/accommodation/image-response";

@Component({
  selector: 'app-all-accommodations-view',
  templateUrl: './view-all-accommodations.component.html',
  styleUrls: ['./view-all-accommodations.component.css'],
})
export class ViewAllAccommodationsComponent implements OnInit, OnDestroy {
  loggedUser: User;
  userId: string;
  userIsGuest: boolean;
  accommodations: HotelCardResponse[];
  authSubscription: Subscription;
  images: ImageResponse[];

  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private accommodationService: AccommodationService,
  ) {}

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private getAccommodations(userId: string) {
    this.searchService.getAccommodationsByUserId(userId).subscribe(
      accommodations => {
        this.accommodations = accommodations;
        const getImagesRequests: GetImagesRequest[] = accommodations?.map(accommodation => ({
          id: accommodation.id
        }));
        if (getImagesRequests && getImagesRequests.length > 0){
          this.accommodationService.getAccommodationImages(getImagesRequests).subscribe(
            images => {
              this.images = images;
            }
          )
        }
      }
    )
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['id']
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
        this.loggedUser = loggedUser;
        this.userIsGuest = this.authService.isUserGuest(loggedUser);
        this.getAccommodations(params['id']? params['id']: loggedUser.sub)
      });
    });
  }

  getImagesForAccommodation(accommodationId: string) {
    return this.images?.find(image => image.id === accommodationId)
  }
}

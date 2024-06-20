import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from "@angular/forms";
import {SearchService} from '../../../auth/services/search.service';
import {SearchRequest} from '../../models/search/search-request';
import {HotelCardResponse} from "../../models/hotel-card-response";
import {User} from "../../models/user/user";
import {AuthService} from "../../services/auth.service";
import {GetImagesRequest} from "../../models/accommodation/get-images-request";
import {AccommodationService} from "../../../accommodation/services/accommodation.service";
import {ImageResponse} from "../../models/accommodation/image-response";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  authSubscription: Subscription;
  topHotels: HotelCardResponse[];
  loggedUser: User;
  images: ImageResponse[] = [];
  shouldShowTotalPrice: boolean = false;

  constructor(
    private searchService: SearchService,
    private toast: ToastrService,
    private authService: AuthService,
    private accommodationService: AccommodationService,
  ) {
    this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
      this.loggedUser = loggedUser;
    });
    this.searchForm = this.getEmptyForm();
  }

  ngOnInit(): void {
    const searchRequest: SearchRequest = {
      location: undefined,
      guest_number: undefined,
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),
    };
    this.searchService.search(searchRequest).subscribe({
      next: searchResponse => {
        this.topHotels = searchResponse;
        this.getAccommodationImages(searchResponse)
      },
      error: err => {
        this.toast.error('Error occurred while trying to search accommodation!', 'Search failed');
      }
    })
  }

  searchAccommodation(): void {
    const searchRequest = this.createSearchRequest();
    this.searchService.search(searchRequest).subscribe({
      next: searchResponse => {
        this.topHotels = searchResponse;
        this.shouldShowTotalPrice = this.searchForm.value.dates.start && this.searchForm.value.dates.end;
        this.getAccommodationImages(searchResponse);
      },
      error: err => {
        this.toast.error('Error occurred while trying to search accommodation!', 'Search failed');
      }
    })
  };

  createSearchRequest(): SearchRequest {
    let guest_number = this.searchForm.value.numberOfGuests === "" ? undefined : this.searchForm.value.numberOfGuests;
    let address = this.searchForm.value.address === "" ? undefined : this.searchForm.value.address;

    return {
      location: address,
      guest_number: guest_number,
      start: this.setDateRequest(this.searchForm.value.dates.start),
      end: this.setDateRequest(this.searchForm.value.dates.end),
    };
  }

  setDateRequest(date: Date): Date {
    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    return newDate;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private getEmptyForm() {
    return new FormGroup({
      address: new FormControl(''),
      dates: new FormGroup({
        start: new FormControl<Date | null>(null),
        end: new FormControl<Date | null>(null),
      }),
      numberOfGuests: new FormControl(''),
      price: new FormGroup({
        min: new FormControl(0),
        max: new FormControl(50000),
      }),
    });
  }

  getImagesForAccommodation(accommodationId: string) {
    return this.images?.find(image => image.id === accommodationId)
  }

  private getAccommodationImages(searchResponse: HotelCardResponse[]) {
    if (searchResponse){
      const getImagesRequests: GetImagesRequest[] = searchResponse?.map(accommodation => ({
        id: accommodation.id
      }));
      this.accommodationService.getAccommodationImages(getImagesRequests).subscribe(
        images => {
          this.images = images;
        }
      )
    }
  }

  getNumberOfVisibleHotels() {
    if (this.topHotels?.length > 2) return 3;
    return this.topHotels?.length;
  }
}

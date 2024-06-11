import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup } from "@angular/forms";
import { SearchService } from '../../../auth/services/search.service';
import { SearchRequest } from '../../models/search/search-request';
import { SearchResponse } from '../../models/search/search-response';
import { HotelCardResponse } from "../../models/hotel-card-response";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  authSubscription: Subscription;
  topHotels: HotelCardResponse[];
  //TODO: FROM home page call searchService (not from search component)

  constructor(
    private searchService: SearchService,
    private toast: ToastrService,
  ) {
    this.searchForm = this.getEmptyForm();
  }

  ngOnInit(): void {

    const searchRequest: SearchRequest = {
      location: undefined,
      guest_number: undefined,
      start: new Date(),
      end: new Date(new Date().setDate(new Date().getDate() + 1)),  // tomorrow
      min_price: this.searchForm.value.price.min,
      max_price: this.searchForm.value.price.max,
    };
    this.searchService.search(searchRequest).subscribe({
      next: searchResponse => {
        console.log(searchResponse);
        // this.topHotels = searchResponse // todo add
      },
      error: err => {
        console.error(err);
        this.toast.error('Error occured while trying to search accommodation!', 'Search failed');
      }
    })
    this.topHotels = [
      {
        id: "23",
        rating: 2,
        name: "Villa Stone",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 2",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 3",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 4",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 5",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 6",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 7",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 8",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 9",
        location: "Beograd",
        unit_price: 299,
        total_price: 300,
        price_type: "perPerson",
        main_photo: "menuet.jpg"
      },
    ]
  }

  searchAccommodation(): void {
    const searchRequest = this.createSearchRequest();
    this.searchService.search(searchRequest).subscribe({
      next: searchResponse => {
        console.log(searchResponse);
      },
      error: err => {
        console.error(err);
        this.toast.error('Error occured while trying to search accommodation!', 'Search failed');
      }
    })
  };

  createSearchRequest(): SearchRequest {
    let guest_number = this.searchForm.value.numberOfGuests === "" ? undefined : this.searchForm.value.numberOfGuests;
    let address = this.searchForm.value.address === "" ? undefined : this.searchForm.value.address;

    const searchRequest: SearchRequest = {
      location: address,
      guest_number: guest_number,
      start: this.setDateRequest(this.searchForm.value.dates.start),
      end: this.setDateRequest(this.searchForm.value.dates.end),
      min_price: this.searchForm.value.price.min,
      max_price: this.searchForm.value.price.max,
    };

    return searchRequest;
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

  getPriceTypeText(priceType: string) {
    return priceType === "PerGuest" ? "per person" : "per apartment unit";
  }
}

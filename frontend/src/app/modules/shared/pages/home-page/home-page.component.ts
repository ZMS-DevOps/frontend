import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {FormControl, FormGroup} from "@angular/forms";
import {HotelCardResponse} from "../../models/hotel-card-response";

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
    private toast: ToastrService,
  ) {
    this.searchForm = this.getEmptyForm();
  }

  ngOnInit(): void {
    this.topHotels = [
      {
        id: "23",
        rating: 2,
        name: "Villa Stone",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 2",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 3",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 4",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 5",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 6",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 7",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 8",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
      {
        id: "23",
        rating: 2,
        name: "Villa Stone 9",
        address: "Beograd",
        price: 299,
        priceType: "perPerson",
        images: ["menuet.jpg"]
      },
    ]
  }


  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  private getEmptyForm() {
    return new FormGroup({
      address: new FormControl(''),
      dates: new FormControl(''),
      numberOfGuests: new FormControl(''),
      price: new FormControl(''),
    });
  }

  getPriceTypeText(priceType: string) {
    return priceType === "PerGuest" ? "per person" : "per apartment unit";
  }
}

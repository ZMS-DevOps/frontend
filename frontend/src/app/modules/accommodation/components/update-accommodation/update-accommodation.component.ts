import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EndDate, StartDate} from "ngx-daterangepicker-material/daterangepicker.component";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {STEPPER_GLOBAL_OPTIONS} from "@angular/cdk/stepper";
import {maxGuestsValidator} from "./max-guests.validator";
import {AccommodationResponse} from "../../../shared/models/accommodation/accommodation-response";
import {AccommodationRequest, toAccommodationRequest} from "../../../shared/models/accommodation/accommodation-request";
import {catchError, Subscription, tap} from "rxjs";
import {AccommodationService} from "../../services/accommodation.service";
import {UpdateAccommodationPriceRequest} from "../../../shared/models/accommodation/update-accommodation-price-request";
import {ToastrService} from "ngx-toastr";
import {DisableDatesResponse} from "../../../shared/models/disable-dates-response";

@Component({
  selector: 'app-update-accommodation',
  templateUrl: './update-accommodation.component.html',
  styleUrls: ['./update-accommodation.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
})
export class UpdateAccommodationComponent implements OnInit, OnDestroy {
  @Input() accommodation: AccommodationResponse;
  @Input() userId: string;

  @Output() onStartDateChanged = new EventEmitter<StartDate>();
  @Output() onEndDateChanged = new EventEmitter<EndDate>();
  @Output() onUpdateAccommodation = new EventEmitter<FormData>();
  // @Output() onUpdateAccommodation = new EventEmitter<AccommodationRequest>();

  updateAccommodationForm: FormGroup;
  updatePriceFormGroup: FormGroup;
  currentStep: number = 0;

  updateSubscription: Subscription;
  @Input() disableDates: DisableDatesResponse[];

  constructor(private accommodationService: AccommodationService, private toast: ToastrService) {}

  ngOnInit(): void {
    if (this.accommodation){
      this.updateAccommodationForm = this.getAccommodationForm();
      this.updatePriceFormGroup = this.getUpdatePriceForm();
    }
  }

  onStepChange(event: any): void {
    this.currentStep = event.selectedIndex;
  }

  private getAccommodationForm() {
    return new FormGroup({
      name: new FormControl(this.accommodation?.name, [Validators.required]),
      location: new FormControl(this.accommodation?.location, [Validators.required]),
      minGuests: new FormControl(this.accommodation?.guest_number.min, Validators.min(1)),
      maxGuests: new FormControl(this.accommodation?.guest_number.max),
      benefits: new FormControl(this.accommodation?.benefits),
      photos: new FormControl([]),
      reviewReservationRequestAutomatically: new FormControl(true)
    }, [maxGuestsValidator('minGuests', 'maxGuests')]);
  }

  private getUpdatePriceForm(): FormGroup {
    console.log(this.accommodation)
    return new FormGroup({
      start: new FormControl(null),
      end: new FormControl(null),
      price: new FormControl(this.accommodation?.default_price.price, [Validators.required, Validators.min(0)]),
      type: new FormControl(this.accommodation?.default_price.type, [Validators.required, Validators.pattern(/^(PerApartmentUnit|PerGuest)$/)])
    });
  }

  updateAccommodation() {

    this.onUpdateAccommodation.emit(toAccommodationRequest(this.updateAccommodationForm, this.userId, false, this.accommodation.default_price.price, this.accommodation.default_price.type));
  }

  updateAccommodationPrice() {
    const updatePriceRequest: UpdateAccommodationPriceRequest = {
      date_range: {
        start: this.updatePriceFormGroup.get("start").value,
        end: this.updatePriceFormGroup.get("end").value
      },
      price: this.updatePriceFormGroup.get("price").value,
      type: this.updatePriceFormGroup.get("type").value
    }
    this.updateSubscription = this.accommodationService.updateAccommodationPrice(this.accommodation.id, updatePriceRequest)
      .pipe(tap(_ => this.toast.success('Successfully change accommodation price.', 'Success!')),
        catchError(error => {
          this.toast.error(error.error, 'Changing accommodation price failed');
          throw error;
        })
      ).subscribe({
        error: error => console.error('Error during changing accommodation price:', error)
      });
  }

  ngOnDestroy(): void {
    if (this.updateSubscription){
      this.updateSubscription.unsubscribe();
    }
  }
}

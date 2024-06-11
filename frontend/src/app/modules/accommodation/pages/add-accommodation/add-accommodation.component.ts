import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {catchError, finalize, interval, map, Observable, of, startWith, Subscription, tap} from "rxjs";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ACCOMMODATION_BENEFITS} from "../../components/accommodation-details/constants";
import {FileUploadSource} from "../../components/file-upload/models/upload-source";
import {maxGuestsValidator} from "../../components/update-accommodation/max-guests.validator";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {toAccommodationRequest} from "../../../shared/models/accommodation/accommodation-request";
import {AccommodationService} from "../../services/accommodation.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-accommodation',
  templateUrl: './add-accommodation.component.html',
  styleUrls: ['./add-accommodation.component.scss']
})
export class AddAccommodationComponent implements OnInit, OnDestroy {
  @ViewChild('benefitInput') benefitInput: ElementRef<HTMLInputElement>;
  addAccommodationForm: FormGroup;
  loggedUser: User;
  authSubscription: Subscription;
  addAccommodationSubscription: Subscription;

  allAccommodationBenefits: string[] = ACCOMMODATION_BENEFITS.map(benefit=>benefit.name);
  filteredAccommodationBenefits: Observable<string[]>;
  announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  benefitCtrl = new FormControl('');

  files: File[] = [];
  images: string[] = [];
  filesIndexes: number[] = [];
  error: boolean = false;
  _allowMultiple = true;
  _showStatusBar = false;

  constructor(
    private authService: AuthService,
    private accommodationService: AccommodationService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.addAccommodationForm = this.getEmptyForm();
    this.filteredAccommodationBenefits = this.benefitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allAccommodationBenefits.slice())),
    );
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
      this.loggedUser = loggedUser;
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.addAccommodationSubscription) {
      this.addAccommodationSubscription.unsubscribe();
    }
  }

  save(){
    for (let file of this.files){
      this.addAccommodationForm.get("photos").value.push(file)
      // this.addAccommodationForm.get("photos").value.push(URL.createObjectURL(file))
    }
    this.addAccommodationSubscription = this.accommodationService.addAccommodation(toAccommodationRequest(this.addAccommodationForm, this.loggedUser.sub, true)).pipe(
      tap(_ => {
        this.toast.success(
          `Please go to your profile to see new accommodation`,
          'New accommodation successfully added'
        );
        this.router.navigate(["/booking/accommodation/view"]);
      }),
      catchError(error => {
        this.toast.error(error.error, 'Adding new accommodation failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during adding accommodation:', error)
    });
  }

  getError(){
    return this.addAccommodationForm.hasError('maxGuestsLessThanMinGuests')
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.addAccommodationForm.get("benefits")?.value.push(value);
    }
    event.chipInput!.clear();
    this.benefitCtrl.setValue(null);
  }

  remove(benefit: string): void {
    const index = this.addAccommodationForm.get("benefits")?.value.indexOf(benefit);

    if (index >= 0) {
      this.addAccommodationForm.get("benefits")?.value.splice(index, 1);
      this.announcer.announce(`Removed ${benefit}`);
    }
  }

  getBenefits(): string[] {
    return this.addAccommodationForm.get("benefits")?.value;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addAccommodationForm.get("benefits")?.value.push(event.option.viewValue);
    this.benefitInput.nativeElement.value = '';
    this.benefitCtrl.setValue(null);
  }

  getReviewReservationRequestClass(group: boolean) {
    return this.addAccommodationForm.get("reviewReservationRequestAutomatically").value === group?
      "container-clicked":
      "container";
  }

  getPriceTypeClass(group: string) {
    return this.addAccommodationForm.get("priceType").value === group?
      "container-clicked":
      "container";
  }

  getNumberOfVisibleImages() {
    return this.images.length >= 3 ? 3:
      this.images.length === 2 ? 2: 1;
  }

  getSaveButtonStyle() {
    return this.addAccommodationForm.invalid?
      {'background-color': '#ecf2ef', 'color': 'var(--text-gray)'} :
      {'background-color': 'var(--green)', 'color': 'var(--white)'}
  }

  resetForm() {
    const formControls = this.addAccommodationForm.controls;

    Object.keys(formControls).forEach(controlName => {
      if (controlName === "benefits" || controlName === "photos"){
        formControls[controlName].setValue([]);
      }else {
        formControls[controlName].setValue(null);
      }
      formControls[controlName].setErrors(null);
    });

    this.addAccommodationForm.markAsPristine();
    this.addAccommodationForm.markAsUntouched();
    this.filesIndexes.forEach(index => this._uploadSource.delete(index))
  }

  _uploadSource: FileUploadSource = {
    upload: (file: File, uploadItemId: number) => {
      let progress = 0;
      return interval(1000).pipe(
        finalize(() =>{
          if (!this._allowMultiple){
            this.files = [];
            this.filesIndexes = []
          }
          this.files.push(file);
          this.filesIndexes.push(uploadItemId);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.images.push(e.target.result);
          };
          reader.readAsDataURL(file);

        }),
        map(() => {
          progress += Math.floor(Math.random() * 10 + 1);

          return Math.min(progress, 100);
        })
      );
    },
    delete: (uploadItemId: number) => {
      console.log("nla")
      const index = this.filesIndexes.indexOf(uploadItemId);
      console.log(index)
      this.files.splice(index, 1);
      this.images.splice(index, 1);
      this.filesIndexes.splice(index, 1);
      return of(uploadItemId);
    },
  };

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAccommodationBenefits.filter(benefit => benefit.toLowerCase().includes(filterValue));
  }

  private getEmptyForm() {
    return new FormGroup({
      name: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      minGuests: new FormControl(null, [Validators.required, Validators.min(1)]),
      maxGuests: new FormControl(null, [Validators.required]),
      benefits: new FormControl([]),
      photos: new FormControl([]),
      reviewReservationRequestAutomatically: new FormControl(true),
      price: new FormControl(null, [Validators.required, Validators.min(1)]),
      priceType: new FormControl(null, [Validators.required, Validators.pattern(/^(PerApartmentUnit|PerGuest)$/)])
    }, [maxGuestsValidator('minGuests', 'maxGuests')]);
  }
}

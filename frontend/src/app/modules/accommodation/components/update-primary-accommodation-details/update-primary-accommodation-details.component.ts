import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {finalize, interval, map, Observable, of, startWith} from "rxjs";
import {FileUploadSource} from "../file-upload/models/upload-source";
import {ControlContainer, FormControl, FormGroup} from "@angular/forms";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ACCOMMODATION_BENEFITS} from "../accommodation-details/constants";

@Component({
  selector: 'app-update-primary-accommodation-details',
  templateUrl: './update-primary-accommodation-details.component.html',
  styleUrls: ['./update-primary-accommodation-details.component.scss']
})
export class UpdatePrimaryAccommodationDetailsComponent implements OnInit {
  @ViewChild('benefitInput') benefitInput: ElementRef<HTMLInputElement>;
  updateAccommodationForm: FormGroup;

  allAccommodationBenefits: string[] = ACCOMMODATION_BENEFITS.map(benefit=>benefit.name);
  filteredAccommodationBenefits: Observable<string[]>;
  announcer = inject(LiveAnnouncer);
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  benefitCtrl = new FormControl('');
  groupedImages: string[][] = [];

  files: File[] = [];
  images: string[] = [];
  filesIndexes: number[] = [];
  error: boolean = false;
  _allowMultiple = true;
  _showStatusBar = false;

  constructor(private controlContainer: ControlContainer) {
    this.updateAccommodationForm = <FormGroup>this.controlContainer.control;
    this.filteredAccommodationBenefits = this.benefitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allAccommodationBenefits.slice())),
    );
  }

  ngOnInit(): void {
    this.updateAccommodationForm = <FormGroup>this.controlContainer.control;
    this.groupImagesInPairs();
  }

  getError(){
    return this.updateAccommodationForm.hasError('maxGuestsLessThanMinGuests')
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.updateAccommodationForm.get("benefits")?.value.push(value);
    }
    event.chipInput!.clear();
    this.benefitCtrl.setValue(null);
  }

  remove(benefit: string): void {
    const index = this.updateAccommodationForm.get("benefits")?.value.indexOf(benefit);

    if (index >= 0) {
      this.updateAccommodationForm.get("benefits")?.value.splice(index, 1);
      this.announcer.announce(`Removed ${benefit}`);
    }
  }

  getBenefits(): string[] {
    return this.updateAccommodationForm.get("benefits")?.value;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.updateAccommodationForm.get("benefits")?.value.push(event.option.viewValue);
    this.benefitInput.nativeElement.value = '';
    this.benefitCtrl.setValue(null);
  }

  getClass(group: boolean) {
    return this.updateAccommodationForm.get("reviewReservationRequestAutomatically").value === group?
      "container-clicked":
      "container";
  }

  _uploadSource: FileUploadSource = {
    upload: (file: File, uploadItemId: number) => {
      let progress = 0;
      return interval(1000).pipe(
        finalize(() =>{
          console.log(`Upload stream complete: [${uploadItemId}][${file.name}]`);
          if (!this._allowMultiple){
            this.files = [];
            this.filesIndexes = []
          }
          this.files.push(file);
          this.filesIndexes.push(uploadItemId);
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.images.push(e.target.result);
            this.groupImagesInPairs();
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
      const index = this.filesIndexes.indexOf(uploadItemId);
      this.files.splice(index, 1);
      this.images.splice(index, 1);
      this.groupImagesInPairs();
      this.filesIndexes.splice(index, 1);
      return of(uploadItemId);
    },
  };

  private groupImagesInPairs() {
    this.groupedImages = [];
    for (let i = 0; i < this.images.length; i += 3) {
      this.groupedImages.push([this.images.at(i), this.images.at(i+1), this.images.at(i+2)]);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAccommodationBenefits.filter(benefit => benefit.toLowerCase().includes(filterValue));
  }
}

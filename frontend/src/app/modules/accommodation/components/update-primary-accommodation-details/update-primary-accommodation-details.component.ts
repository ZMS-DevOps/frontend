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
    if (this.updateAccommodationForm){
      for (let photo of this.updateAccommodationForm.get("photos").value){
        this.files.push(this.dataURLtoFile(photo, this.makeRandomFileName()))
      }
      for (let i=0; i < this.updateAccommodationForm.get("photos").value; i++){
        this.filesIndexes.push(i);
      }
      this.images = this.updateAccommodationForm.get("photos").value
      this.groupImagesInPairs();
    }
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
          this.updateAccommodationForm.get("photos").setValue(this.files)
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
      this.updateAccommodationForm.get("photos").setValue(this.files)
      return of(uploadItemId);
    },
  };

  private groupImagesInPairs() {
    this.groupedImages = [];
    console.log(this.images)
    for (let i = 0; i < this.images.length; i += 3) {
      console.log(i)
      console.log(this.images[i])
      this.groupedImages.push([this.images.at(i), this.images.at(i+1), this.images.at(i+2)]);
    }
    console.log(this.groupedImages)
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allAccommodationBenefits.filter(benefit => benefit.toLowerCase().includes(filterValue));
  }

  private dataURLtoFile(dataUrl: string, filename: string) {
    let arr = dataUrl.split(',');
    let mime = "image/jpeg";
    let bstr = atob(arr[arr.length - 1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  }

  private makeRandomFileName() {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let text = "";
    for (let i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}

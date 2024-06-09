import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, FormGroup} from "@angular/forms";
import {EndDate, StartDate} from "ngx-daterangepicker-material/daterangepicker.component";
import dayjs from "dayjs";
import {SpecialPrice} from "../../../shared/models/accommodation/accommodation-response";
import {DisableDatesResponse} from "../../../shared/models/disable-dates-response";

@Component({
  selector: 'app-update-accommodation-price',
  templateUrl: './update-accommodation-price.component.html',
  styleUrls: ['./update-accommodation-price.component.scss']
})
export class UpdateAccommodationPriceComponent implements OnInit {
  @Input() defaultPrice: {price: number, type: string };
  @Input() specialPrice: SpecialPrice[];

  updatePriceFormGroup: FormGroup;
  selected: {start: Date, end: Date};
  @Input() disableDates: DisableDatesResponse[];

  constructor(private controlContainer: ControlContainer) {
    this.updatePriceFormGroup = <FormGroup>this.controlContainer.control;
  }

  ngOnInit(): void {
    this.updatePriceFormGroup = <FormGroup>this.controlContainer.control;
  }

  getClass(group: string) {
    return this.updatePriceFormGroup.get("type").value === group?
      "container-clicked":
      "container";
  }

  onStartDateChanged(startDate: StartDate) {
    if (!this.selected){
      this.selected= {start: null, end: null}
    }
    this.selected.start = dayjs(startDate.startDate).toDate();
    this.updatePriceFormGroup.get("start").setValue(dayjs(startDate.startDate).toDate())
  }

  onEndDateChanged(endDate: EndDate) {
    const tempDate = dayjs(endDate.endDate).toDate();
    tempDate.setDate(tempDate.getDate()-1);
    this.selected.end = tempDate;
    this.updatePriceFormGroup.get("end").setValue(tempDate)
  }
}

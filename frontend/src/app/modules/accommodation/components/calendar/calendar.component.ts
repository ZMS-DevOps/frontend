import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {EndDate, StartDate} from "ngx-daterangepicker-material/daterangepicker.component";
import moment from "moment";
import {SpecialPrice} from "../../../shared/models/accommodation/accommodation-response";
import {UnavailabilityPeriodResponse} from "../../../shared/models/unavailability-response";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterViewInit {
  @ViewChild('datePickerInput', { static: false }) datePickerInput: ElementRef;
  @Input() defaultPrice: {price: number, type: string };
  @Input() specialPrice: SpecialPrice[];
  @Input() selected: { start: Date; end: Date };
  @Input() disableDates: UnavailabilityPeriodResponse[];

  @Output() onStartDateChanged = new EventEmitter<StartDate>();
  @Output() onEndDateChanged = new EventEmitter<EndDate>();

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.datePickerInput.nativeElement.click();
    }, 0);
    this.setPrice(this.getCalendar("left"));
    this.setPrice(this.getCalendar("right"));
    const thPrevElement = document.querySelector('th.prev.available');
    thPrevElement.addEventListener('click', () => {
      this.setPrice(this.getCalendar("left"));
      this.setPrice(this.getCalendar("right"));

    });

    const thNextElement = document.querySelector('th.next.available');
    thNextElement.addEventListener('click', () => {
      this.setPrice(this.getCalendar("left"));
      this.setPrice(this.getCalendar("right"));
    });

    const calendar = this.datePickerInput.nativeElement;
    this.setPrice(calendar);
  }

  private isDateDisabled(date: Date): boolean {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    if (moment(date).isBefore(today)){
      return true;
    }
    return this.disableDates?.some(range => {
        return moment(date).isBetween(range.start, range.end, 'day', '[]');
      }
    );
  }

  private getCalendar(direction: string) {
    return document.querySelector(`div.calendar.${direction}`);

  }

  private setPrice(calendar: Element){
      const months = calendar.querySelectorAll('th.month');
      months.forEach(month => {
        const availableTds = calendar.querySelectorAll('td.available');
        availableTds.forEach(td => {
          const existingSpan = td.querySelector('span');
          if (existingSpan) {
            const existPrice = td.querySelector('div');
            if (existPrice) {
              const date = this.setPriceToDiv(month.textContent, existingSpan, existPrice);
              if (this.isDateDisabled(date)) {
                td.classList.add('disabled');
              } else {
                td.classList.remove('disabled');
              }
            }else {
              const priceDiv = document.createElement('div');
              const date = this.setPriceToDiv(month.textContent, existingSpan, priceDiv);
              if (this.isDateDisabled(date)) {
                td.classList.add('disabled');
              } else {
                td.classList.remove('disabled');
              }
              td.appendChild(priceDiv);
            }
          }
        });
      });
  }

  private setPriceToDiv(month:string, day: HTMLSpanElement, existPrice: HTMLDivElement){
    let date: Date = new Date(month);
    date.setDate(Number(day.innerText));

    const entry = this.specialPrice?.find(item => {
      return moment(date).isBetween(item.date_range?.start, item.date_range?.end, 'day', '[]')
    });
    if (entry) {
      existPrice.innerHTML = `${entry.price}$`;
    } else {
      existPrice.innerHTML = `${this.defaultPrice.price}$`;
    }
    return date;
  }

  startDateChanged(startDate: StartDate) {
    this.onStartDateChanged.emit(startDate);
  }

  endDateChanged(endDate: EndDate) {
    this.onEndDateChanged.emit(endDate);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() searchForm: FormGroup<any>;
  @Output() searchAccommodation: EventEmitter<void> = new EventEmitter<void>();
  dateToday: Date = new Date();

  onSearch() {
    this.searchAccommodation.emit();
  }
}

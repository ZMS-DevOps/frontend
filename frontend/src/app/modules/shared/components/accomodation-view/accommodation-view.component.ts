import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-accommodation-view',
    templateUrl: './accommodation-view.component.html',
    styleUrls: ['./accommodation-view.component.scss']
})
export class AccommodationViewComponent {

    @Input() hotel: any;
    @Input() getPriceTypeText: (priceType: string) => (string);
}

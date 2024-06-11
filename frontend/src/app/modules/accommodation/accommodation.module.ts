import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AccommodationRoutes} from "./accommodation.routes";
import {CustomMaterialModuleModule} from "../../custom-material-module/custom-material-module.module";
import {NgxStarsModule} from "ngx-stars";
import {SharedModule} from "../shared/shared.module";
import {CarouselModule} from "primeng/carousel";
import {ViewAccommodationComponent} from "./pages/view-accommodation/view-accommodation.component";
import {AuthModule} from "../auth/auth.module";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {AccommodationDetailsComponent} from "./components/accommodation-details/accommodation-details.component";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {UpdateAccommodationComponent} from "./components/update-accommodation/update-accommodation.component";
import {FileUploadModule} from "./components/file-upload/file-upload.module";
import { UpdatePrimaryAccommodationDetailsComponent } from './components/update-primary-accommodation-details/update-primary-accommodation-details.component';
import {
  UpdateAccommodationPriceComponent
} from "./components/update-accommodation-price/update-accommodation-price.component";
import {AddAccommodationComponent} from "./pages/add-accommodation/add-accommodation.component";
import {ViewAllAccommodationsComponent} from "./pages/view-all-accommodations/view-all-accommodations.component";
import {
  CalendarCommonModule, CalendarDateFormatter,
  CalendarDayModule,
  CalendarModule, CalendarMomentDateFormatter,
  CalendarMonthModule,
  CalendarWeekModule, DateAdapter, MOMENT
} from "angular-calendar";
import {adapterFactory} from "angular-calendar/date-adapters/moment";
import moment from "moment/moment";
import {ShowEventDialogComponent} from "./components/show-event-dialog/show-event-dialog.component";
import {ScheduleModule} from "@syncfusion/ej2-angular-schedule";
import {DatePickerModule} from "@syncfusion/ej2-angular-calendars";

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [
    ViewAccommodationComponent,
    AccommodationDetailsComponent,
    CalendarComponent,
    UpdateAccommodationComponent,
    UpdatePrimaryAccommodationDetailsComponent,
    UpdatePrimaryAccommodationDetailsComponent,
    UpdateAccommodationPriceComponent,
    AddAccommodationComponent,
    ViewAllAccommodationsComponent,
    ShowEventDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModuleModule,
    NgxStarsModule,
    SharedModule,
    CarouselModule,
    NgOptimizedImage,

    AuthModule,
    RouterModule.forChild(AccommodationRoutes),
    NgxDaterangepickerMd,
    FileUploadModule,
    CalendarWeekModule,
    CalendarDayModule,
    CalendarMonthModule,
    CalendarCommonModule,
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: momentAdapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CalendarMomentDateFormatter,
        },
      }
    ),
    ScheduleModule,
    DatePickerModule,
  ],
  providers: [
    {
      provide: MOMENT,
      useValue: moment,
    },
  ],
})
export class AccommodationModule { }

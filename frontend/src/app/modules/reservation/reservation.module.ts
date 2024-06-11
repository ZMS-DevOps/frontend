import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ViewReservationsComponent} from "./pages/view-reservations/view-reservations.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ReservationRoutes} from "./reservation.routes";
import {CustomMaterialModuleModule} from "../../custom-material-module/custom-material-module.module";
import {NgxStarsModule} from "ngx-stars";
import {SharedModule} from "../shared/shared.module";
import {CarouselModule} from "primeng/carousel";
import {
  ReservationCarouselItemComponent
} from "./components/reservation-carousel/reservation-carousel-item.component";
import {
  CancelReservationDialogComponent
} from "./components/cancel-reservation-dialog/cancel-reservation-dialog.component";
import {ReservationCalendarComponent} from "./pages/reservation-calendar/reservation-calendar.component";
import {ScheduleModule} from "@syncfusion/ej2-angular-schedule";

@NgModule({
  declarations: [
    ViewReservationsComponent,
    ReservationCarouselItemComponent,
    CancelReservationDialogComponent,
    ReservationCalendarComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModuleModule,
    RouterModule.forChild(ReservationRoutes),
    NgxStarsModule,
    SharedModule,
    CarouselModule,
    ScheduleModule,
  ],
  providers: [],
})
export class ReservationModule { }

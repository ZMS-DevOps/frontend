import {Routes} from "@angular/router";
import {ViewReservationsComponent} from "./pages/view-reservations/view-reservations.component";
import {ReservationCalendarComponent} from "./pages/reservation-calendar/reservation-calendar.component";

export const ReservationRoutes: Routes = [
  {
    path: 'view',
    children: [
      {path: '', component: ViewReservationsComponent},
      {path: ':id', component: ViewReservationsComponent}
    ]
  },
  {
    path: 'calendar',
    children: [
      {path: '', component: ReservationCalendarComponent},
      {path: ':id', component: ReservationCalendarComponent}
    ]
  },
];

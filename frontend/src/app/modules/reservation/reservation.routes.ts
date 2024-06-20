import {Routes} from "@angular/router";
import {ViewReservationsComponent} from "./pages/view-reservations/view-reservations.component";
import {ReservationCalendarComponent} from "./pages/reservation-calendar/reservation-calendar.component";
import {RoleGuard} from "../auth/guards/role/role.guard";

export const ReservationRoutes: Routes = [
  {
    path: 'view',
    children: [
      {path: '', component: ViewReservationsComponent},
      {path: ':id', component: ViewReservationsComponent}
    ],
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host|guest'},
  },
  {
    path: 'calendar',
    children: [
      {path: '', component: ReservationCalendarComponent},
      {path: ':id', component: ReservationCalendarComponent}
    ],
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host|guest'},
  },
];

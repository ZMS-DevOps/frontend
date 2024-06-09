import {Routes} from "@angular/router";
import {ViewAccommodationComponent} from "./pages/view-accommodation/view-accommodation.component";
import {AddAccommodationComponent} from "./pages/add-accommodation/add-accommodation.component";
import {RoleGuard} from "../auth/guards/role/role.guard";
import {ViewAllAccommodationsComponent} from "./pages/view-all-accommodations/view-all-accommodations.component";

export const AccommodationRoutes: Routes = [
  {
    path: "add",
    pathMatch: "full",
    component: AddAccommodationComponent,
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host'},
  },
  {
    path: "view",
    children: [
      {path: '', component: ViewAllAccommodationsComponent},
      {path: ':id', component: ViewAllAccommodationsComponent}
    ]
    // canActivate: [RoleGuard],
    // data: {expectedRoles: 'host|guest'},
  },
  {
    path: ":id",
    pathMatch: "full",
    component: ViewAccommodationComponent,
  },
];

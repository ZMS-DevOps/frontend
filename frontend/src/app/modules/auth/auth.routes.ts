import {Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {UnauthUserGuard} from "./guards/login/login.guard";

export const AuthRoutes: Routes = [
  {
    path: "login",
    pathMatch: "full",
    component: LoginComponent,
    canActivate: [UnauthUserGuard]
  },
]

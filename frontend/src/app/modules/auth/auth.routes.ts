import {Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {UnauthUserGuard} from "./guards/login/login.guard";
import {SignupComponent} from "./pages/signup/signup.component";

export const AuthRoutes: Routes = [
  {
    path: "login",
    pathMatch: "full",
    component: LoginComponent,
    canActivate: [UnauthUserGuard]
  },
  {
    path: "signup",
    pathMatch: "full",
    component: SignupComponent,
    canActivate: [UnauthUserGuard]
  },
]

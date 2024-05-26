import {Routes} from "@angular/router";
import {LoginComponent} from "./pages/login/login.component";
import {UnauthUserGuard} from "./guards/login/login.guard";
import {SignupComponent} from "./pages/signup/signup.component";
import {RoleGuard} from "./guards/role/role.guard";
import {VerifyComponent} from "./pages/verify/verify.component";
import {SuccessfulVerificationComponent} from "./pages/successfull-verification/successful-verification.component";
import {ViewProfileComponent} from "./pages/view-profile/view-profile.component";
import {UpdatePasswordComponent} from "./pages/update-password/update-password.component";
import {UpdateProfileComponent} from "./pages/update-profile/update-profile.component";

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
  {
    path: "verify/:id",
    pathMatch: "full",
    component: VerifyComponent,
    canActivate: [UnauthUserGuard]
  },
  {
    path: "successful-verification",
    component: SuccessfulVerificationComponent,
    canActivate: [UnauthUserGuard]
  },
  {
    path: "view-profile/:userId",
    pathMatch: "full",
    component: ViewProfileComponent,
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host|quest'},
  },
  {
    path: "update-password",
    pathMatch: "full",
    component: UpdatePasswordComponent,
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host|quest'},
  },
  {
    path: "update-profile",
    pathMatch: "full",
    component: UpdateProfileComponent,
    canActivate: [RoleGuard],
    data: {expectedRoles: 'host|quest'},
  }
];

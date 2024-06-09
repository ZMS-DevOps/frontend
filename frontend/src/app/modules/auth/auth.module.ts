import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./pages/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {AuthRoutes} from "./auth.routes";
import {CustomMaterialModuleModule} from "../../custom-material-module/custom-material-module.module";
import {NgxStarsModule} from "ngx-stars";
import {SharedModule} from "../shared/shared.module";
import {CarouselModule} from "primeng/carousel";
import {SignupComponent} from "./pages/signup/signup.component";
import {UpdateProfileComponent} from "./pages/update-profile/update-profile.component";
import {SuccessfulVerificationComponent} from "./pages/successfull-verification/successful-verification.component";
import {ViewProfileComponent} from "./pages/view-profile/view-profile.component";
import {UpdatePasswordComponent} from "./pages/update-password/update-password.component";
import {VerifyComponent} from "./pages/verify/verify.component";
import {AddReviewComponent} from "./components/add-review/add-review.component";
import {UserDetailsComponent} from "./components/user-details/user-details.component";
import {ReviewComponent} from "./components/review/review.component";
import {ReviewReportComponent} from "./components/review-report/review-report.component";

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    SuccessfulVerificationComponent,
    ViewProfileComponent,
    UpdatePasswordComponent,
    VerifyComponent,
    UpdateProfileComponent,
    UserDetailsComponent,
    ReviewComponent,
    AddReviewComponent,
    ReviewReportComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomMaterialModuleModule,
    RouterModule.forChild(AuthRoutes),
    NgxStarsModule,
    SharedModule,
    CarouselModule,
  ],
  providers: [],
  exports: [
    ReviewReportComponent
  ]
})
export class AuthModule { }

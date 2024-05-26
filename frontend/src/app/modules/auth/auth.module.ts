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

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
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
})
export class AuthModule { }

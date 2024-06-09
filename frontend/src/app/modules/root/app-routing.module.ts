import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommonModule} from "@angular/common";
import {CustomMaterialModuleModule} from "../../custom-material-module/custom-material-module.module";
import {RootLayoutComponent} from "./pages/root-layout/root-layout.component";
import {NotFoundPageComponent} from "./pages/not-found-page/not-found-page.component";

export const routes: Routes = [
  {
    path: "booking",
    component: RootLayoutComponent,
    children: [
      {
        path: "auth",
        loadChildren: () =>
            import("./../auth/auth.module").then((m) => m.AuthModule),
      },
      {
        path: "",
        loadChildren: () =>
          import("./../shared/shared.module").then((m) => m.SharedModule),
      }]
  },
  {
    path: "",
    redirectTo: "/booking/home-page",
    pathMatch: "full",
  },
  { path: "**", component: NotFoundPageComponent }
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes), CustomMaterialModuleModule],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}

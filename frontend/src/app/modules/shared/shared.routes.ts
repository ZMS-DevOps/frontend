import {Routes} from "@angular/router";
import {HomePageComponent} from "./pages/home-page/home-page.component";

export const SharedRoutes: Routes = [
  {
    path: "home-page",
    pathMatch: "full",
    component: HomePageComponent
  },
]

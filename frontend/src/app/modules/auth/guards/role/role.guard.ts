import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(public authService: AuthService, public  router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRoles: string = route.data['expectedRoles'];
    const user: User = this.authService.getLoggedParsedUser();
    if (!user){
      this.router.navigate(["/booking/auth/login"]);
      return false;
    }

    const roles: string[] = expectedRoles.split("|", 2);
    if (!roles.some(role => user.roles.includes(role))){
      this.router.navigate(["/booking/home-page"]);
      return false;
    }

    return true;

  }

}

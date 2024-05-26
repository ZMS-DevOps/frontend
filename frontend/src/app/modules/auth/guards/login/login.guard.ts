import { Injectable } from '@angular/core';
import {CanActivate, Router } from '@angular/router';
import {AuthService} from "../../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UnauthUserGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.authService.tokenIsValid()){
      this.router.navigate(["/booking/home-page"]);

      return false;
    }

    return true;
  }
}

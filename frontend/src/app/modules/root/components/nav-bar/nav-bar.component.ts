import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {LinkService} from "../../../shared/services/link.service";
import {User} from "../../../shared/models/user/user";
import {Subscription} from "rxjs";
import {AuthService} from "../../../auth/services/auth.service";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  loggedUser: User;
  authSubscription: Subscription;
  userIsHost: boolean;
  userIsGuest: boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    public linkService: LinkService
  ) {
    this.userIsHost = false;
    this.userIsGuest = false;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(
      user => {
        this.loggedUser = user;
        this.userIsHost = this.authService.isUserHost(user);
        this.userIsGuest = this.authService.isUserGuest(user);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  redirectToHomePage() {
    this.router.navigate(['/booking/home-page']);
  }

  logOut() {
    this.router.navigate(['/booking/home-page']);
    this.authService.logOut();
  }

  redirectToProfilePage() {
    this.router.navigate([`/booking/auth/view-profile/${this.loggedUser.sub}`]);
  }

  redirectToEditPage() {
    this.router.navigate(['/booking/auth/update-profile']);
  }

  redirectToResetPassword() {
    this.router.navigate(['/booking/auth/update-password']);
  }
}

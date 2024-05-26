import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {LinkService} from "../../../shared/services/link.service";
import {User} from "../../../shared/models/user/user";
import {Subscription} from "rxjs";

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
    private router: Router,
    public linkService: LinkService
  ) {
    this.userIsHost = false;
    this.userIsGuest = false;
  }

  ngOnInit(): void {
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

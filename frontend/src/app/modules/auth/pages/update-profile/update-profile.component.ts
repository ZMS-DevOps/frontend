import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormControl, FormGroup, Validators} from '@angular/forms';
import { Subscription} from 'rxjs';
import {AuthService} from "../../../shared/services/auth.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserResponse} from "../../../shared/models/user/user";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css'],
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  updateUserForm: FormGroup;
  authSubscription: Subscription;
  loggedUser: UserResponse;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.getUserFromToken().subscribe(
      user => {
        this.loggedUser = user;
        this.updateUserForm = this.getEmptyForm(user);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  update() {
    this.userService.updateUser(this.loggedUser.sub, this.updateUserForm.getRawValue()).subscribe({
      next: res => {
        this.toast.success('User info is updated successfully.', 'Success!');
        this.router.navigate([`/booking/auth/view-profile/${this.loggedUser.sub}`])
      },
      error: err => {
        this.toast.error(err.error, 'Profile update failed');
      }
    });
  }

  private getEmptyForm(user: UserResponse) {
    return new FormGroup(
      {
        firstName: new FormControl(user ? user.given_name: '', [Validators.required]),
        lastName: new FormControl(user ? user.family_name: '', [Validators.required]),
        email: new FormControl(user ? user.email: '', [Validators.required, Validators.email]),
        address: new FormControl(user ? user.address: '', [Validators.required])
      });
  }
}


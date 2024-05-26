import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {catchError, Subscription, tap} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import { ErrorStateMatcher } from '@angular/material/core';
import { matchPasswordsValidator } from './confirm-password.validator';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";
import {User} from "../../../shared/models/user/user";

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css'],
})
export class UpdatePasswordComponent implements OnInit, OnDestroy {
  updatePasswordForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hidePassword = true;
  hideConfirmPassword = true;
  loggedUser: User;

  loggedUserSubscription: Subscription;
  updatePasswordSubscription: Subscription;

  ngOnInit(): void {
    this.loggedUserSubscription = this.authService.getSubjectCurrentUser().subscribe(
      user => {
        this.loggedUser = user;
      }
    );
  }

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.updatePasswordForm = this.getEmptyForm();
  }
  ngOnDestroy(): void {
    if (this.loggedUserSubscription) {
      this.loggedUserSubscription.unsubscribe();
    }
    if (this.updatePasswordSubscription) {
      this.updatePasswordSubscription.unsubscribe();
    }
  }

  updatePassword() {

    this.updatePasswordSubscription = this.userService.resetPassword(this.loggedUser.sub, this.updatePasswordForm.getRawValue()).pipe(
      tap(res => {
        this.toast.success('User password is updated successfully.', 'Success!');
        this.authService.logOut();
        this.router.navigate([`/booking/auth/login`]);
      }),
      catchError(error => {
        this.toast.error(error.error, 'Reset password cannot be done');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during resetting password:', error)
    });
  }

  getErrorPasswordMismatchMessage() {

    return (!this.updatePasswordForm.get('password').hasError('pattern') &&
            !this.updatePasswordForm.get('confirmPassword').hasError('pattern')) &&
            this.updatePasswordForm.hasError('mismatch');
  }

  private getEmptyForm() {
    return new FormGroup(
      {
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern("^(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$")
        ]),
        confirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(12),
          Validators.pattern("^(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$")
        ]),
      },
      [matchPasswordsValidator()])
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}


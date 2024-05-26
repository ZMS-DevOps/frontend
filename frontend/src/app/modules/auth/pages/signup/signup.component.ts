import {Component, OnDestroy, OnInit} from '@angular/core';

import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { Subscription} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import { ErrorStateMatcher } from '@angular/material/core';
import { matchPasswordsValidator } from './confirm-password.validator';
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup;
  matcher = new MyErrorStateMatcher();
  hidePassword = true;
  hideConfirmPassword = true;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.registrationForm = this.getEmptyForm();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  signup() {
    console.log(this.registrationForm.getRawValue());
    const email = this.registrationForm.get('email').value;
    this.authService.signup(this.registrationForm.getRawValue()).subscribe({
      next: res => {
        this.toast.success(
          `Please go to ${email} to verify account!`,
          'Registration successfully'
        );
        this.router.navigate(
          [`/booking/auth/verify/${res.verificationId}`],
          { queryParams: { email: email, userId: res.userId } }
        );
      },
      error: err => {
        console.error(err);
        this.toast.error(err.error.charAt(0).toUpperCase() + err.error.slice(1), 'Registration failed');
      }
    });
  }

  getErrorEmailMessage() {
    if (this.registrationForm.get('email').hasError('required')) {
      return 'Email is required';
    }

    return this.registrationForm.get('email').hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getErrorPasswordMismatchMessage() {

    return (!this.registrationForm.get('password').hasError('pattern') &&
            !this.registrationForm.get('confirmPassword').hasError('pattern')) &&
            this.registrationForm.hasError('mismatch');
  }

  private getEmptyForm() {
    return new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        address: new FormControl('', [Validators.required]),
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
        group: new FormControl('guest', [Validators.required])
      },
      [matchPasswordsValidator()])
  }

  getClass(group: string) {
    return this.registrationForm.get("group").value === group?
      "container-clicked":
      "container";
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


import {Component, OnDestroy} from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription} from 'rxjs';
import {AuthService} from "../../../shared/services/auth.service";
import { ToastrService } from 'ngx-toastr';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;

  hide = true;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private toast: ToastrService,
    private router: Router,
  ) {
    this.loginForm = this.getEmptyForm();
  }

  getErrorMessage() {
    if (this.loginForm.get('email').hasError('required')) {
      return 'Email is required';
    }

    return this.loginForm.get('email').hasError('email')
      ? 'Not a valid email'
      : '';
  }

  login() {
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: loggedUser => {
        this.authService.setLocalStorage(loggedUser);
        this.router.navigate(['/booking/home-page']);
      },
      error: err => {
        console.error(err);
        this.toast.error('Account invalid credentials!', 'Login failed');
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private getEmptyForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{12,}$"),
      ]),
    });
  }
}

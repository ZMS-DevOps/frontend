import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {catchError, Subscription, tap} from 'rxjs';
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {VerifyService} from "../../services/verify.service";

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;
  verificationId: string;
  userEmail: string;
  userId: string;

  authSubscription: Subscription;
  verifySubscription: Subscription;
  sendCodeAgainSubscription: Subscription;
  showVerifyForm: boolean;

  constructor(
    private verifyService: VerifyService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.verifyForm = this.getEmptyForm();
    this.showVerifyForm = true;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.verificationId = params['id'];
    });
    this.route.queryParams.subscribe(queryParams => {
      this.userEmail = queryParams['email'];
      this.userId = queryParams['userId'];
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.verifySubscription) {
      this.verifySubscription.unsubscribe();
    }
  }

  verify() {
    this.verifySubscription = this.verifyService.verify(this.getVerifyRequest()).pipe(
      tap(res => {
        this.toast.success('You became a new member of Booking.zms!', 'Verification successful');
        this.router.navigate(['/booking/auth/successful-verification']);
      }),
      catchError(error => {
        this.toast.error(error.error, 'Verification failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during verification:', error)
    });
  }

  sendCodeAgain() {
    this.sendCodeAgainSubscription = this.verifyService
      .sendCodeAgain(this.verificationId, this.userEmail)
      .pipe(
        tap(res => {
          this.showVerifyForm = !this.showVerifyForm;
        }),
        catchError(error => {
          this.toast.error('Email cannot be sent.', 'Code cannot be sent');
          throw error;
        })
      ).subscribe({
        error: error => console.error('Error during sending code again:', error)
      });
  }

  getVerifyButtonClass() {
    return this.verifyForm.invalid ?
      "verify-button-disabled":
      "verify-button-enabled";
  }

  private getVerifyRequest() {
    const securityCode: string = this.verifyForm.get("firstDigit").value +
      this.verifyForm.get("secondDigit").value +
      this.verifyForm.get("thirdDigit").value +
      this.verifyForm.get("fourthDigit").value;

    return this.verifyService.createVerifyRequest(
      this.verificationId,
      this.userId,
      Number(securityCode),
    )
  }

  private getEmptyForm() {
    return new FormGroup(
      {
        firstDigit: new FormControl('', [Validators.required]),
        secondDigit: new FormControl('', [Validators.required]),
        thirdDigit: new FormControl('', [Validators.required]),
        fourthDigit: new FormControl('', [Validators.required]),
      });
  }
}


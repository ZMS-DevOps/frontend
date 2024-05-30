import {Component, OnDestroy, OnInit} from '@angular/core';
import {catchError, Subscription, tap} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../shared/models/user/user";
import {UserService} from "../../services/user.service";
import {ReviewReportResponse} from "../../../shared/models/review-report-response";
import {MatExpansionPanel} from "@angular/material/expansion";
import {GradeService} from "../../services/grade.service";

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  userId: string;
  loggedUser: User;
  userForView: User;
  reviewReportResponse: ReviewReportResponse;

  authSubscription: Subscription;
  deleteUserSubscription: Subscription;
  getReviewsSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private gradeService: GradeService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.getUserForViewProfile();
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(
        loggedUser => {
          this.loggedUser = loggedUser;
        });
      this.getReviews(this.userId);
    });
  }

  onDeleteUser() {
    this.deleteUserSubscription = this.userService.deleteUser(this.loggedUser?.sub).pipe(
      tap(_ => {
        this.toast.success('User is successfully deleted.', 'Success!');
        this.router.navigate([`/booking/home-page`]);
        this.authService.logOut();
      }),
      catchError(error => {
        this.toast.error(error.error, 'Deleting user cannot be done');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during deleting user:', error)
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.deleteUserSubscription){
      this.deleteUserSubscription.unsubscribe()
    }
    if (this.getReviewsSubscription){
      this.getReviewsSubscription.unsubscribe()
    }
  }

  private getUserForViewProfile() {
    this.userService.getUserById(this.userId).subscribe(
      userForView => {
        this.userForView = userForView;
      }
    )
  }

  private getReviews(userId: string) {
    this.getReviewsSubscription = this.gradeService.getAllReviewsBySubReviewed(userId, 0).pipe(
      tap(res => {
        this.reviewReportResponse = res;
      }),
      catchError(error => {
        this.toast.error(error.error, 'Getting reviews failed');
        throw error;
      })
    ).subscribe({
      error: error => console.error('Error during getting reviews:', error)
    });
  }
}

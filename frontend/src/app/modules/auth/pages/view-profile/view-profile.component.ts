import {Component, OnDestroy, OnInit} from '@angular/core';

import {catchError, Subscription, tap} from 'rxjs';
import {AuthService} from "../../services/auth.service";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../../shared/models/user/user";
import {UserService} from "../../services/user.service";
import {ReviewResponse, SingleReview} from "../../../shared/models/review-response";
import {MatExpansionPanel} from "@angular/material/expansion";

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
  viewProviders: [MatExpansionPanel]
})
export class ViewProfileComponent implements OnInit, OnDestroy {
  userId: string;
  loggedUser: User;
  authSubscription: Subscription;
  deleteUserSubscription: Subscription;
  userForView: User;
  review: ReviewResponse;
  maxRating: number;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.userId = params['userId'];
      this.getUserForViewProfile();
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(
        loggedUser => {
          this.loggedUser = loggedUser;
        });
      //TODO: get user's reviews by id from grade service
      this.setDummyReviews();
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.deleteUserSubscription){
      this.deleteUserSubscription.unsubscribe()
    }
  }

  addReview(review: { grade: number; comment: string; }) {
    console.log(review);
    //TODO: add grade service call for adding new review for user with this.userId
  }

  getNgStyle(label: string) {
    if (label === '5'){
      return {'background-color': '#d3f1d9', 'color': '#3bda5c'}
    } else if (label === '4') {
      return {'background-color': '#f4dbf0', 'color': '#ea67db'}
    } else if (label === '3') {
      return {'background-color': '#fff4d8', 'color': '#ffb400'}
    } else if (label === '2') {
      return {'background-color': '#d7e9f3', 'color': '#5bb5e9'}
    }
    return {'background-color': '#f4dac9', 'color': '#f27010'}
  }

  onDeleteUser() {
    this.deleteUserSubscription = this.userService.deleteUser(this.loggedUser?.sub).pipe(
      tap(res => {
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

  private getUserForViewProfile() {
    this.userService.getUserById(this.userId).subscribe(
      userForView => {
        this.userForView = userForView;
      }
    )
  }

  private setDummyReviews() {
    this.review = {
      totalReviews: 10,
      averageRating: 4.2,
      numberOfStars: [
        {
          label: "5",
          value: 3,
        },
        {
          label: "4",
          value: 2,
        },
        {
          label: "3",
          value: 1,
        },
        {
          label: "2",
          value: 4,
        },
        {
          label: "1",
          value: 1,
        },
      ],
      reviews: [
        {
          id: "sasa",
          comment: "At least everything was new. Apartment was \n" +
            "clean. Excellent accommodation!",
          grade: 4,
          subReviewer: "221",
          fullName: "Milan Milic",
          dateOfCreation: new Date()
        },
        {
          id: "a2323213",
          comment: "A fresh new hotel, very clean, beautiful sheets\n" +
            "and towels. The girl who works is very pleasent.",
          grade: 2,
          subReviewer: "st213123ring",
          fullName: "Mi Milic",
          dateOfCreation: new Date()
        },
        {
          id: "BBBB2323213",
          comment: "t assleast everything was new. Apartment was \n" +
            "clean. Excellent accommodation!",
          grade: 4,
          subReviewer: "st213123ring",
          fullName: "Zoki Zokic",
          dateOfCreation: new Date()
        }
      ]
    }

    this.maxRating = Math.max(...this.review.numberOfStars.map(r => r.value))
  }

  onDeleteReview(reviewId: string) {
    console.log("DELETING REVIEW WITH ID " + reviewId)
    //TODO: call grade service to delete review with specified id
    this.review.reviews = this.review.reviews.filter(review => review.id !== reviewId);
    this.toast.success("Comment deleted")
  }

  onUpdateReview(singleReview: SingleReview) {
    console.log(singleReview);
    //TODO: call grade service to update review
  }
}

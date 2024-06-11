import {Component, EventEmitter, Input, Output} from '@angular/core';
import {User} from "../../../shared/models/user/user";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DeleteDialogComponent} from "../../../shared/components/delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent{
  @Input() user: User;
  @Input() loggedUserId: string;
  @Output() deletingUserEvent = new EventEmitter<null>();
  @Input() userIsGuest: boolean;

  constructor(private router: Router, private dialog: MatDialog) {}

  redirectToEditProfile() {
    this.router.navigate(["/booking/auth/update-profile"]);
  }
  redirectToEditPassword() {
    this.router.navigate(["/booking/auth/update-password"]);
  }

  redirectToDeleteProfile() {
    const dialogRef = this.dialog.open(DeleteDialogComponent,
      {
        data: "user",
      });
    dialogRef.afterClosed().subscribe(resp => {
      if (resp){
        this.deleteUser()
      }
    });
  }

  deleteUser() {
    this.deletingUserEvent.emit();
  }

  getAccommodationViewUrl() {
    return `/booking/accommodation/view/${this.user.sub}`;
  }
}

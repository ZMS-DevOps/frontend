import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {LinkService} from "../../../shared/services/link.service";
import {User} from "../../../shared/models/user/user";
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {FormControl, FormGroup} from "@angular/forms";
import {MatMenuTrigger} from "@angular/material/menu";
import {NotificationService} from "../../services/notification.service";
import {ToastrService} from "ngx-toastr";
import {
  UserNotificationSettingsResponse
} from "../../../shared/models/notification/user-notification-settings-response";
import {
  UpdateUserNotificationSettingsRequest
} from "../../../shared/models/notification/update-user-notification-settings-request";
import {BellNotification} from "../../../shared/models/notification/bell-notification";

@Component({
  selector: 'nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;
  loggedUser: User;
  authSubscription: Subscription;
  userIsHost: boolean;
  userIsGuest: boolean;
  updateNotificationSettingsForm: FormGroup;

  bellNotificationsSubscription: Subscription;
  bellAllSeenSubscription: Subscription;
  bellNotifications: BellNotification[];
  numOfNotifications: number;

  constructor(
    private authService: AuthService,
    private router: Router,
    public linkService: LinkService,
    private notificationService: NotificationService,
    private toast: ToastrService,
  ) {
    this.userIsHost = false;
    this.userIsGuest = false;

    this.bellNotifications = [];
    this.numOfNotifications = 0;
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(
      user => {
        this.loggedUser = user;
        if (user){
          this.userIsHost = this.authService.isUserHost(user);
          this.userIsGuest = this.authService.isUserGuest(user);
          this.loadBellNotifications(user?.sub);
          this.subscribeToUserNotifications();
        }
      }
    );
  }

  private subscribeToUserNotifications() {
    this.notificationService.getSubjectCurrentNotifications().subscribe(
      notifications => {
        this.bellNotifications = notifications;
        this.loadNumOfNotifications();
      }
    );
  }

  ngAfterViewInit() {
    this.menuTrigger.menuOpened.subscribe(() => {
      this.onNotificationSettingsMenuOpened();
    });
  }


  loadBellNotifications(userId: string): void {
    this.bellNotificationsSubscription = this.notificationService.getBellNotifications(userId).subscribe(
      res => {
        if (res) {
          this.bellNotifications = res;
        }
      }
    );
  }

  loadNumOfNotifications(): void {
    this.numOfNotifications = this.notificationService.getNumOfNotifications();
  }

  setAllAsSeen(): void {
    if (this.numOfNotifications > 0) {
      this.bellAllSeenSubscription = this.notificationService.setAllAsSeen(this.loggedUser.sub).subscribe(
        res => {
          if (res) {
            this.bellNotifications.filter(notification => notification.seen = true);
            this.numOfNotifications = 0;
          }
        }
      );
    }
  }

  bellNotificationsDelete() {
    this.notificationService.resetBell();
  }

  notificationRedirect(bellNotification: BellNotification): void {
    if (bellNotification.shouldRedirect) {
      this.router.navigate([`/booking/${bellNotification.redirectId}`]);
    }
  }

  onNotificationSettingsMenuCancel() {
    this.menuTrigger.closeMenu();
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
    this.bellNotificationsDelete();
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

  updateNotificationSettings() {
    const settings: UpdateUserNotificationSettingsRequest = {
      settings: this.getUpdatedUserNotificationSettings(),
      role: this.loggedUser.roles.find(role => role === "host" || role === "guest")
    }

    this.notificationService.updateUserNotificationSettings(this.loggedUser.sub, settings).subscribe({
      next: _ => {
        this.toast.success('Notification settings is updated successfully.', 'Success!');
      },
      error: err => {
        this.toast.error('Updating user notification settings failed');
      }
    });
  }

  private setForm(settings: UserNotificationSettingsResponse[]) {
    return new FormGroup(
      {
        newReservationRequest: new FormControl(settings.find(setting => setting.type === 0)?.active),
        cancelReservation: new FormControl(settings.find(setting => setting.type === 1)?.active),
        newHostReview: new FormControl(settings.find(setting => setting.type === 2)?.active),
        newAccommodationReview: new FormControl(settings.find(setting => setting.type === 3)?.active),
        reservationReview: new FormControl(settings.find(setting => setting.type === 4)?.active),
      });
  }

  private onNotificationSettingsMenuOpened() {
    this.notificationService.getUserNotificationSettings(this.loggedUser.sub).subscribe({
      next: res => {
        this.updateNotificationSettingsForm = this.setForm(res);
      },
      error: _ => {
        this.toast.error('Getting user notification settings failed');
      }
    });
  }

  private getUpdatedUserNotificationSettings() {
    return [
      {
        type: 0,
        active: this.updateNotificationSettingsForm.get("newReservationRequest").value,
      },
      {
        type: 1,
        active: this.updateNotificationSettingsForm.get("cancelReservation").value,
      },
      {
        type: 2,
        active: this.updateNotificationSettingsForm.get("newHostReview").value,
      },
      {
        type: 3,
        active: this.updateNotificationSettingsForm.get("newAccommodationReview").value,
      },
      {
        type: 4,
        active: this.updateNotificationSettingsForm.get("reservationReview").value,
      }
    ];
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {PasswordUpdateRequest, UpdateUserProfileRequest} from "../../shared/models/user/user-profile-update";
import {UserResponse} from "../../shared/models/user/user";
import {UserNotificationSettingsResponse} from "../../shared/models/notification/user-notification-settings-response";
import {
  UpdateUserNotificationSettingsRequest
} from "../../shared/models/notification/update-user-notification-settings-request";
import {BellNotification} from "../../shared/models/notification/bell-notification";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  bell$: BehaviorSubject<BellNotification[]>;
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    this.bell$ = new BehaviorSubject<BellNotification[]>([]);
  }

  getUserNotificationSettings(userId: string): Observable<UserNotificationSettingsResponse[]> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<UserNotificationSettingsResponse[]>(
      `${this.configService.NOTIFICATIONS_URL}/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  updateUserNotificationSettings(id: string, updatedSettings: UpdateUserNotificationSettingsRequest): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.NOTIFICATIONS_URL}/${id}`,
      updatedSettings,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getBellNotifications(userId: string): BehaviorSubject<BellNotification[]> {
    const accessToken = localStorage.getItem('access-token');
    this.http.get<BellNotification[]>(
        `${this.configService.BELL_NOTIFICATIONS_URL}/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      )
      .subscribe(res => {
        this.bell$.next(res);
      });

    return this.bell$;
  }

  setAllAsSeen(userId: string): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
        `${this.configService.BELL_NOTIFICATIONS_URL}/${userId}/seen`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
        )
  }

  getNumOfNotifications(): number {
    return this.bell$.value.reduce((accumulator, notification) => {
      return accumulator + (notification.seen ? 0 : 1);
    }, 0);
  }

  addNotification(bellNotification: BellNotification): void {
    const copyNotifications: BellNotification[] = this.bell$.value;
    this.bell$.next([bellNotification, ...copyNotifications]);
  }

  resetBell(): void {
    this.bell$.next([]);
  }

  getSubjectCurrentNotifications() {
    return this.bell$;
  }
}

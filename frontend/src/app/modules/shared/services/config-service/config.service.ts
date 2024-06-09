import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  LOGIN_URL = `/auth/login`;
  SIGNUP_URL = `/auth/signup`;
  VERIFY_URL = `/auth/verify`;
  SEND_CODE_AGAIN_URL = `/auth/send-code-again`;

  USERS_URL = `/user`;
  GRADE_URL = `/grade`;
  ACCOMMODATION_URL = `/accommodation`;
  BOOKING_URL = `/booking`;
  UNAVAILABILITY_URL = `${this.BOOKING_URL}/unavailability`;
  NOTIFICATIONS_URL = `/notification`;
  BELL_NOTIFICATIONS_URL = `/notification/bell`;

  getLoginUrl(): string {
    return this.LOGIN_URL;
  }
}

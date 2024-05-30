import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  AUTH_SERVICE_URL = environment.AUTH_SERVICE_URL;
  ACCOMMODATION_SERVICE_URL = environment.ACCOMMODATION_SERVICE_URL;
  BOOKING_SERVICE_URL = environment.BOOKING_SERVICE_URL;
  GRADE_SERVICE_URL = environment.GRADE_SERVICE_URL;
  SEARCH_SERVICE_URL = environment.SEARCH_SERVICE_URL;

  LOGIN_URL = `/auth/login`;
  SIGNUP_URL = `/auth/signup`;
  VERIFY_URL = `/auth/verify`;
  SEND_CODE_AGAIN_URL = `/auth/send-code-again`;

  USERS_URL = `/user`;
  GRADE_URL = `/grade`;

  getLoginUrl(): string {
    return this.LOGIN_URL;
  }
}

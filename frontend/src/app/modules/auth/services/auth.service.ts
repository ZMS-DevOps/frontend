import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {LoginRequest} from "../../shared/models/user/login-request";
import {LoginResponse} from "../../shared/models/user/login-response";
import {User} from "../../shared/models/user/user";
import {JwtHelperService} from "@auth0/angular-jwt";
import {UserProfileRequest} from "../../shared/models/user/user-profile-update";
import {RegistrationResponse} from "../../shared/models/user/registration-response";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$: BehaviorSubject<User>;

  ROLE_HOST: string;
  ROLE_GUEST: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private jwtHelper: JwtHelperService,
  ) {
    this.currentUser$ = new BehaviorSubject<User>(null);
    this.ROLE_HOST= 'host';
    this.ROLE_GUEST = 'quest';
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      this.configService.getLoginUrl(),
      loginRequest
    );
  }

  signup(registrationRequest: UserProfileRequest): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(
      this.configService.SIGNUP_URL,
      registrationRequest
    );
  }

  setLocalStorage(loginResponse: LoginResponse): void {
    localStorage.setItem('access-token', loginResponse.access_token);
    localStorage.setItem('refresh-token', loginResponse.refresh_token);
    this.currentUser$.next(this.getLoggedParsedUser());
  }

  tokenIsValid(): boolean {
    const accessToken = localStorage.getItem('access-token');
    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    return accessToken && decodedToken && !this.isTokenExpired(decodedToken?.exp);
  }

  isTokenExpired(expiryTime: number): boolean {
    if (expiryTime) {
      return ((1000 * expiryTime) - (new Date()).getTime()) < 5000;
    } else {
      return false;
    }
  }

  getLoggedParsedUser(): User {
    const accessToken = localStorage.getItem('access-token');
    const decodedToken = this.jwtHelper.decodeToken(accessToken);

    if (accessToken && decodedToken && !this.isTokenExpired(decodedToken?.exp)){
      return {
        sub: decodedToken?.sub,
        email: decodedToken?.email,
        given_name: decodedToken?.given_name,
        family_name: decodedToken?.family_name,
        roles: decodedToken?.realm_access?.roles
      }
    }

    return null;
  }
}

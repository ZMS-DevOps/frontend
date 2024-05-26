import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {PasswordUpdateRequest, UpdateUserProfileRequest} from "../../shared/models/user/user-profile-update";
import {UserResponse} from "../../shared/models/user/user";

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
  }

  getUserById(id: string): Observable<UserResponse> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<UserResponse>(
      `${this.configService.USERS_URL}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  updateUser(id: string, updateUserProfileRequest: UpdateUserProfileRequest): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.USERS_URL}/${id}`,
      updateUserProfileRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  resetPassword(id: string, passwordUpdateRequest: PasswordUpdateRequest): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.USERS_URL}/${id}/reset-password`,
      passwordUpdateRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  deleteUser(id: string): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.delete<null>(
      `${this.configService.USERS_URL}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }
}

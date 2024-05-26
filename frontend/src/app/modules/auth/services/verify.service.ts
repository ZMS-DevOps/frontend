import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {VerifyRequest} from "../../shared/models/user/verify-request";

@Injectable({
  providedIn: 'root',
})
export class VerifyService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  verify(verifyRequest: VerifyRequest): Observable<null> {
    return this.http.put<null>(this.configService.VERIFY_URL, verifyRequest);
  }

  sendCodeAgain(verificationId: string, userEmail: string): Observable<null> {
    return this.http.post<null>(
      `${this.configService.SEND_CODE_AGAIN_URL}`,
      {
        verificationId: verificationId,
        userEmail: userEmail
      }
    );
  }

  createVerifyRequest(verificationId: string, userId: string, securityCode: number): VerifyRequest {
    return {
      verificationId: verificationId,
      userId: userId,
      securityCode: securityCode,
    };
  }
}

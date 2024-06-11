import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {ReviewRequest} from "../../shared/models/review-request";
import {UpdateReviewRequest} from "../../shared/models/update-review-request";
import {ReviewReportResponse, SingleReview} from "../../shared/models/review-report-response";

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
  }

  getAllReviewsBySubReviewed(subReviewed: string, type: number): Observable<ReviewReportResponse> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<ReviewReportResponse>(
      `${this.configService.GRADE_URL}/${subReviewed}/${type}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  updateReview(id: string, updateReviewRequest: UpdateReviewRequest): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.GRADE_URL}/${id}`,
      updateReviewRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  addReview(reviewRequest: ReviewRequest): Observable<SingleReview> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.post<SingleReview>(
      this.configService.GRADE_URL,
      reviewRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  deleteReview(id: string, type: number): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.delete<null>(
      `${this.configService.GRADE_URL}/${id}/${type}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }
}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ConfigService} from "../../shared/services/config-service/config.service";
import {AccommodationResponse} from "../../shared/models/accommodation/accommodation-response";
import {HotelCardResponse} from "../../shared/models/hotel-card-response";
import {UpdateAccommodationPriceRequest} from "../../shared/models/accommodation/update-accommodation-price-request";
import {GetImagesRequest} from "../../shared/models/accommodation/get-images-request";
import {ImageResponse} from "../../shared/models/accommodation/image-response";

@Injectable({
  providedIn: 'root',
})
export class AccommodationService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {}

  addAccommodation(accommodationRequest: FormData): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.post<null>(
      this.configService.ACCOMMODATION_URL,
      accommodationRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }


  getAccommodationById(id: string): Observable<AccommodationResponse> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<AccommodationResponse>(
      `${this.configService.ACCOMMODATION_URL}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getAccommodationsByUserId(userId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<HotelCardResponse[]>(
      `${this.configService.ACCOMMODATION_URL}/host/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  delete(id: string): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.delete<null>(
      `${this.configService.ACCOMMODATION_URL}/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  updateAccommodation(accommodationId: string, accommodationUpdateRequest: FormData): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.ACCOMMODATION_URL}/${accommodationId}`,
      accommodationUpdateRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  updateAccommodationPrice(accommodationId: string, updatePriceRequest: UpdateAccommodationPriceRequest): Observable<null> {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.ACCOMMODATION_URL}/price/${accommodationId}`,
      updatePriceRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getAccommodationImages(getImagesRequests: GetImagesRequest[]) {
    return this.http.post<ImageResponse[]>(
      `${this.configService.ACCOMMODATION_URL}/images`,
      getImagesRequests
    );
  }
}

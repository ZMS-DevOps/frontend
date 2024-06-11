import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from "../../shared/services/config-service/config.service";
import { SearchRequest } from '../../shared/models/search/search-request';
import { SearchResponse } from '../../shared/models/search/search-response';
import { HotelCardResponse } from '../../shared/models/hotel-card-response';

@Injectable({
    providedIn: 'root',
})
export class SearchService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
    ) {
    }

    search(searchRequest: SearchRequest): Observable<HotelCardResponse[]> {
        const accessToken = localStorage.getItem('access-token');
        return this.http.post<HotelCardResponse[]>(
            this.configService.SEARCH_URL,
            searchRequest
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

}

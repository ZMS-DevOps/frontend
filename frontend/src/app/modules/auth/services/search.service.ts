import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from "../../shared/services/config-service/config.service";
import { SearchRequest } from '../../shared/models/search/search-request';
import { SearchResponse } from '../../shared/models/search/search-response';

@Injectable({
    providedIn: 'root',
})
export class SearchService {

    constructor(
        private http: HttpClient,
        private configService: ConfigService,
    ) {
    }

    search(searchRequest: SearchRequest): Observable<SearchResponse[]> {
        const accessToken = localStorage.getItem('access-token');
        return this.http.post<SearchResponse[]>(
            this.configService.SEARCH_URL,
            searchRequest
        );
    }

    // searchAll() {
    //     return this.http.get<SearchResponse>(
    //         this.configService.SEARCH_URL,
    //         searchRequest
    //     );
    // }

}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ConfigService} from "./config-service/config.service";
import {AddReservationRequest} from "../models/reservation/add-reservation-request";
import {UnavailabilityPeriodResponse} from "../models/unavailability-response";
import {ReservationResponse} from "../models/reservation/reservation-response";
import {UnavailabilityPeriodRequest} from "../models/unavailability-request";

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {}

  getUnavailabilityPeriodsForHostsAccommodation(hostId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<UnavailabilityPeriodResponse[]>(
      `${this.configService.UNAVAILABILITY_URL}/host/${hostId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  createReservationRequest(reservationRequest: AddReservationRequest) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.post<null>(
      `${this.configService.BOOKING_URL}/request`,
      reservationRequest,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  approveReservationRequest(reservationId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.BOOKING_URL}/request/approve/${reservationId}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  declineReservationRequest(reservationId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.BOOKING_URL}/request/decline/${reservationId}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  declineAcceptedReservationByGuest(reservationId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.BOOKING_URL}/reservation/decline/${reservationId}`,
      null,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getReservationsByUser(userId: string, userType: string, pastReservation: boolean, searchParam: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<ReservationResponse[]>(
      `${this.configService.BOOKING_URL}/request/user/${userId}?user-type=${userType}&past=${pastReservation}&search=${searchParam}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getReservationsByAccommodationId(accommodationId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<ReservationResponse[]>(
      `${this.configService.BOOKING_URL}/request/all/${accommodationId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  deleteUnavailabilityPeriod(period: UnavailabilityPeriodRequest) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.UNAVAILABILITY_URL}/remove`,
      period,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  saveUnavailabilityPeriod(period: UnavailabilityPeriodRequest) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.put<null>(
      `${this.configService.UNAVAILABILITY_URL}/add`, period,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }

  getDisableDates(accommodationId: string) {
    const accessToken = localStorage.getItem('access-token');
    return this.http.get<UnavailabilityPeriodResponse[]>(
      `${this.configService.UNAVAILABILITY_URL}/accommodation/${accommodationId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );
  }
}

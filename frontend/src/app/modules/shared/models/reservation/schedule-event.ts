import {ReservationResponse} from "./reservation-response";
import {UnavailabilityPeriodResponse} from "../unavailability-response";

export interface ScheduleEvent {
  PeriodId?: string;
  AccommodationId: string;
  AccommodationName: string;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  EventType: number;
  Color: string;
  Id: number;
  NumOfGuests?: number;
  NumOfCanceledReservations?: number;
  UserId?: string;
  cssClass: string
}

export function toScheduleEventFromReservationResponse(res: ReservationResponse[], scheduleData: ScheduleEvent[]): ScheduleEvent[] {
  res.forEach(period => {
    if (period.status <= 1) {
      scheduleData.push({
        PeriodId: period.id,
        Subject: period.accommodation_name,
        AccommodationId: period.accommodation_id,
        AccommodationName: period.accommodation_name,
        StartTime: period.start,
        EndTime: period.end,
        EventType: period.status,
        Id: getResourceId(period.status),
        Color: getResourceColor(period.status),
        NumOfGuests: period.number_of_guests,
        NumOfCanceledReservations: period.number_of_canceled_reservations,
        UserId: period.user_id,
        cssClass: getCssClassForEventType(period.status)
      })
    }
  });

  return scheduleData;
}

export function toScheduleEventFromUnavailabilityResponse(res: UnavailabilityPeriodResponse[], scheduleData: ScheduleEvent[]): ScheduleEvent[] {
  res.forEach(period => {
      scheduleData.push({
        PeriodId: period.id,
        Subject: period.accommodation_name,
        AccommodationId: period.accommodation_id,
        AccommodationName: period.accommodation_name,
        StartTime: period.start,
        EndTime: period.end,
        EventType: 2,
        Id: getResourceId(2),
        Color: getResourceColor(2),
        cssClass: getCssClassForEventType(2)
      })
  });

  return scheduleData;
}

export function getResourceId(type: number) {
  const resourceDataSource = getResourceDataSource()
  if (type === 0){
    return resourceDataSource.at(0).Id
  } else if (type === 1){
    return resourceDataSource.at(1).Id
  }

  return resourceDataSource.at(2).Id;
}

export function getResourceColor(type: number) {
  const resourceDataSource = getResourceDataSource()
  if (type === 0){
    return resourceDataSource.at(0).Color
  } else if (type === 1){
    return resourceDataSource.at(1).Color
  }

  return resourceDataSource.at(2).Color;
}

export function getCssClassForEventType(eventType: number): string {
  return eventType > 1 ? 'unavailability-cell': ''
}

export function getResourceDataSource(): { Id: number, Color: string }[]{
  return  [
    { Id: 1, Color: '#f0ad4e' },
    { Id: 2, Color: '#71af91' },
    { Id: 3, Color: '#E0E0E0FF' },
  ]
}

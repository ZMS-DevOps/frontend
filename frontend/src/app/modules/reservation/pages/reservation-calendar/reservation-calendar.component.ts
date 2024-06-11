import {Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../../shared/services/auth.service";
import {User} from "../../../shared/models/user/user";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {BookingService} from "../../../shared/services/booking.service";
import {CalendarView, DAYS_OF_WEEK} from "angular-calendar";

import moment from 'moment';
import {MatDialog} from "@angular/material/dialog";
import {
  ActionEventArgs,
  AgendaService,
  CellClickEventArgs,
  DayService,
  DragAndDropService,
  EventClickArgs,
  MonthService,
  RenderCellEventArgs,
  ResizeService,
  ScheduleComponent
} from '@syncfusion/ej2-angular-schedule';
import {
  getCssClassForEventType,
  getResourceColor,
  getResourceId,
  ScheduleEvent,
  toScheduleEventFromReservationResponse,
  toScheduleEventFromUnavailabilityResponse
} from "../../../shared/models/reservation/schedule-event";
import {UnavailabilityPeriodRequest} from "../../../shared/models/unavailability-request";

moment.updateLocale('en', {
  week: {
    dow: DAYS_OF_WEEK.MONDAY,
    doy: 0,
  },
});

@Component({
  selector: 'app-reservation-calendar',
  templateUrl: './reservation-calendar.component.html',
  styleUrls: ['./reservation-calendar.component.scss'],
  providers: [
    DayService, MonthService, AgendaService, ResizeService, DragAndDropService],
  encapsulation: ViewEncapsulation.None
})
export class ReservationCalendarComponent implements OnInit, OnDestroy {
  @ViewChild('schedule') public scheduleObj: ScheduleComponent;
  @ViewChild('customDialog') customDialog: ElementRef;
  public dialogData: any = {};
  resourceDataSource: { Id: number, Color: string }[] = [
      { Id: 1, Color: '#f0ad4e' },
      { Id: 2, Color: '#71af91' },
      { Id: 3, Color: '#E0E0E0FF' },
    ];
  accommodationId: string;
  accommodationName: string;

  public selectedDate: Date = new Date();
  scheduleData: ScheduleEvent[] = [];
  notVisibleScheduleData: ScheduleEvent[] = []
  eventSettings: { dataSource: ScheduleEvent[] };

  view: CalendarView = CalendarView.Month;

  loggedUser: User;
  userIsHost: boolean;
  userIsGuest: boolean;

  authSubscription: Subscription;
  addAccommodationSubscription: Subscription;

  accommodationNamesMap =new Map<string, string>();
  showAllPeriods: boolean[];
  openedExpansionPanel: boolean = true;

  get accommodationNamesArray() {
    return Array.from(this.accommodationNamesMap.keys());
  }

  constructor(
    private authService: AuthService,
    private bookingService: BookingService,
    private toast: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.authSubscription = this.authService.getSubjectCurrentUser().subscribe(loggedUser => {
        this.loggedUser = loggedUser;
        this.userIsHost = this.authService.isUserHost(loggedUser);
        this.userIsGuest = this.authService.isUserGuest(loggedUser);
        if (params['id']){
          this.accommodationId = params['id'];
          this.getCalendarEvents(params['id']);
        }else {
          this.getCalendarEventsByUserId(loggedUser.sub)
        }
      });
    });
    this.route.queryParams.subscribe(queryParams => {
      this.accommodationName = queryParams['accommodationName'];
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.addAccommodationSubscription) {
      this.addAccommodationSubscription.unsubscribe();
    }
  }

  private getCalendarEvents(accommodationId: string) {
    this.bookingService.getReservationsByAccommodationId(accommodationId).subscribe(
      res =>  {
        this.scheduleData = toScheduleEventFromReservationResponse(res, this.scheduleData);
        this.bookingService.getUnavailabilityPeriodsByAccommodationId(accommodationId).subscribe(
          res => {
            this.scheduleData = toScheduleEventFromUnavailabilityResponse(res, this.scheduleData);
            this.getAccommodationNames(this.scheduleData)

            this.eventSettings = {
              dataSource: this.scheduleData
            };
            this.showAllPeriods = Array(this.scheduleData.length).fill(true)
          }
        )
      }
    )
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'monthCells') {
      if (moment(args.date).isBefore(new Date(), 'day')) {
        args.element.classList.add('e-disable-dates');
      }
    }
  }


  isPast(args: ActionEventArgs): boolean {
    return true;
  }

  private getCalendarEventsByUserId(userId: string) {
    if (this.userIsGuest){
      this.bookingService.getReservationsByUser(userId, "guest", false, "").subscribe(
        res => this.scheduleData = toScheduleEventFromReservationResponse(res, this.scheduleData)
      )
    }
    if (this.userIsHost){
      this.bookingService.getReservationsByUser(userId, "host", false, "").subscribe(
        res =>  this.scheduleData = toScheduleEventFromReservationResponse(res, this.scheduleData)
      )
      this.bookingService.getUnavailabilityPeriodsForHostsAccommodation(userId).subscribe(
        res => this.scheduleData = toScheduleEventFromUnavailabilityResponse(res, this.scheduleData)
      )
    }

    this.eventSettings = {
      dataSource: this.scheduleData
    };
    this.getAccommodationNames(this.scheduleData)
    this.showAllPeriods = Array(this.scheduleData.length).fill(true)
  }

  setCheckedForViewPeriod(key: string, i: number, checked: boolean) {
    this.showAllPeriods[i] = checked;
    if (checked){
      this.addPeriodByAccommodationId(this.accommodationNamesMap.get(key))
    } else {
      this.deletePeriodByAccommodationId(this.accommodationNamesMap.get(key))
    }
  }

  setVisibilityOfExpansionPanel() {
    this.openedExpansionPanel = !this.openedExpansionPanel;
  }

  onCellClick(args: CellClickEventArgs): void {
    args.cancel = true;
  }

  onActionBegin(args: ActionEventArgs): void {
    if (args.requestType === 'eventCreate' || args.requestType === 'eventChange' || args.requestType === "eventRemove") {
      if (this.isPast(args)) {
        args.cancel = true;
      }
    }
  }

  onActionComplete(args: any): void {
    if (args.requestType === 'eventRemoved' || args.requestType === 'eventChanged') {
      this.scheduleObj.refresh();
    }
  }

  onCreated(args: any): void {
    if (this.userIsHost && this.accommodationId){
      this.scheduleObj.allowMultiCellSelection = true;
      this.scheduleObj.element.addEventListener('mouseup', (e: MouseEvent) => this.onMouseUp(e));
    }
  }

  onEventClick(args: EventClickArgs): void {
    this.dialogData = args.event;
    const dialog = this.customDialog.nativeElement;
    dialog.style.display = 'block';

    const eventElement = args.element as HTMLElement;
    const rect = eventElement.getBoundingClientRect();
    dialog.style.top = `${rect.bottom + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX}px`;
  }

  onMouseUp(e: MouseEvent): void {
    const selectedCells = this.scheduleObj.getSelectedCells();
    if (selectedCells.length > 1) {
      const startCell = selectedCells[0];
      const endCell = selectedCells[selectedCells.length - 1];

      const startDate = this.scheduleObj.getCellDetails(startCell).startTime;
      const endDate = this.scheduleObj.getCellDetails(endCell).endTime;
      const newUnavailabilityPeriod: UnavailabilityPeriodRequest = {
        accommodation_id: this.accommodationId,
        start: startDate,
        end: endDate,
      }
      this.bookingService.saveUnavailabilityPeriod(newUnavailabilityPeriod).subscribe({
        next: res => {
          this.toast.success(`Successfully added new unavailability period for your accommodation!`, 'Success');
          this.onSuccessAddingNewUnavailabilityPeriod(startDate, endDate)
        },
        error: err => {
          this.toast.error(err.error, 'Saving new unavailability period failed');
        }
      })
    }
  }

  onCloseEventDetailDialog() {
    this.customDialog.nativeElement.style.display = 'none';
  }

  goToAccommodationView(accommodationId: string) {
    this.router.navigate([`/booking/accommodation/${accommodationId}`])
  }

  deletePeriod(periodId: string) {
    const event = this.eventSettings.dataSource.find(period => period.PeriodId === periodId);
    const newUnavailabilityPeriod: UnavailabilityPeriodRequest = {
      accommodation_id: this.accommodationId,
      start: event.StartTime,
      end: event.EndTime,
    }
    this.bookingService.deleteUnavailabilityPeriod(newUnavailabilityPeriod).subscribe({
      next: res => {
        this.toast.success(`Successfully delete unavailability period for your accommodation!`, 'Success');
        const newDataSource = this.eventSettings.dataSource.filter(period => period.PeriodId !== periodId);
        this.refreshCalendarWithNewDataSource(newDataSource);
      },
      error: err => {
        this.toast.error(err.error, 'Deleting unavailability period failed');
      }
    })
  }

  addPeriodByAccommodationId(accommodationId: string) {
    this.notVisibleScheduleData = this.notVisibleScheduleData.filter(period => {
      if (period.AccommodationId === accommodationId) {
        this.eventSettings.dataSource.push(period);
        return false
      }
      return true
    });
    this.refreshCalendarWithNewDataSource(this.eventSettings.dataSource);
  }

  deletePeriodByAccommodationId(accommodationId: string) {
    const newDataSource = this.eventSettings.dataSource.reduce((result, period) => {
      if (period.AccommodationId !== accommodationId) {
        result.keptPeriods.push(period);
      } else {
        this.notVisibleScheduleData.push(period);
      }
      return result;
    }, { keptPeriods: [] });
    this.refreshCalendarWithNewDataSource(newDataSource.keptPeriods);
  }

  private refreshCalendarWithNewDataSource(newDataSource: ScheduleEvent[]) {
    this.eventSettings = {...this.eventSettings, dataSource: newDataSource};

    setTimeout(() => {
      this.eventSettings = {...this.eventSettings, dataSource: newDataSource};
    }, 0);
    if (this.customDialog && this.customDialog.nativeElement) {
      this.customDialog.nativeElement.style.display = 'none';
    }
    this.scheduleObj.refreshEvents();
    this.scheduleObj.refreshLayout();
  }

  private getAccommodationNames(calendarEvents: ScheduleEvent[]) {
    calendarEvents.forEach(event => {
      if (!this.accommodationNamesMap.has(event.AccommodationName)) {
        this.accommodationNamesMap.set(event.AccommodationName, event.AccommodationId);
      }
    })
  }

  getRedirectUserProfileUrl(user_id: string) {
    return `/booking/auth/view-profile/${user_id}`;
  }

  confirmReservation(periodId: string) {
    this.bookingService.approveReservationRequest(periodId).subscribe({
      next: res => {
        this.toast.success(`Successfully approve reservation request!`, 'Success');
        this.onSuccessConfirmReservation(periodId)
      },
      error: err => {
        this.toast.error(err.error, 'Reservation request not approve');
      }
    });
  }

  isSaveChangesButtonDisabled() {

    return this.eventSettings?.dataSource?.length !== this.scheduleData?.length;
  }

  declineReservationRequest(periodId: any) {
    this.bookingService.declineReservationRequest(periodId).subscribe({
      next: res => {
        this.toast.success(`Successfully declined reservation request!`, 'Success');
        this.deletePeriod(periodId);
      },
      error: err => {
        this.toast.error(err.error, 'Reservation request not declined');
      }
    })
  }

  declineAcceptedReservationByGuest(periodId: string) {
    this.bookingService.declineAcceptedReservationByGuest(periodId).subscribe({
      next: _ => {
        this.toast.success(`Successfully declined reservation!`, 'Success');
        this.deletePeriod(periodId);
      },
      error: err => {
        this.toast.error(err.error, 'Reservation not declined');
      }
    })
  }

  private onSuccessConfirmReservation(periodId: string) {
    const index = this.eventSettings.dataSource.findIndex(period => period.PeriodId === periodId);
    if (index !== -1){
      const updatedDataSource = [...this.eventSettings.dataSource];
      updatedDataSource[index] = { ...updatedDataSource[index], EventType: 1,
        Color: getResourceColor(1),
        Id: getResourceId(1),
        cssClass: getCssClassForEventType(1)
      };
      this.eventSettings = { ...this.eventSettings, dataSource: updatedDataSource };
      setTimeout(() => {
        this.eventSettings = { ...this.eventSettings, dataSource: updatedDataSource };
        this.scheduleObj.refreshEvents();
      }, 0);
    }

    this.customDialog.nativeElement.style.display = 'none';
  }

  private onSuccessAddingNewUnavailabilityPeriod(startDate: Date, endDate: Date) {
    const newEvent = {
      StartTime: startDate,
      AccommodationId: this.accommodationId,
      AccommodationName: this.accommodationName,
      EndTime: endDate,
      EventType: 2,
      Color: getResourceColor(2),
      Id: getResourceId(2),
      Subject: "New Unavailability",
      cssClass: getCssClassForEventType(2)
    };

    this.eventSettings.dataSource.push(newEvent);
    this.scheduleObj.refreshEvents();
    this.scheduleObj.refreshLayout();
  }
}

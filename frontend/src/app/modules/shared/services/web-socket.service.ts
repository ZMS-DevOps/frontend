import {Injectable} from '@angular/core';
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {NotificationService} from "../../root/services/notification.service";
import {BellNotification} from "../models/notification/bell-notification";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket$: WebSocketSubject<any>;

  constructor(private notificationService: NotificationService, private authService: AuthService) {
    this.socket$ = new WebSocketSubject('ws://localhost/ws');
    this.socket$.subscribe({
      next: (message) => this.onMessage(message),
      error: (err) => this.onError(err),
      complete: () => this.onClose()
    });
  }


  private onMessage(message: any): void {
    if (typeof message === 'object') {
      const notification: BellNotification = message;
      if (notification.userId === this.authService.getSubjectCurrentUser().value.sub){
        this.notificationService.addNotification(notification);
      }
    } else if (typeof message === 'string') {
      try {
        const notification: BellNotification = JSON.parse(message);
        this.notificationService.addNotification(notification);
        console.log('Parsed message:', notification);
      } catch (e) {
        console.error('Failed to parse message as JSON:', e);
      }
    } else {
      console.error('Received unexpected message type:', message);
    }
  }

  private onError(err: any): void {
    console.error('WebSocket error:', err);
  }

  private onClose(): void {
    console.log('WebSocket connection closed');
  }

  public sendMessage(message: any): void {
    this.socket$.next(message);
  }

  public close(): void {
    this.socket$.complete();
  }
}

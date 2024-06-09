import {Component, OnInit} from '@angular/core';
import {WebSocketService} from "../shared/services/web-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  constructor(private webSocketService: WebSocketService) {
    this.webSocketService.socket$.subscribe((message: string) => {
      console.log("message")
    });
  }

  ngOnInit(): void {
  }
}

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../chat/chat.component';
import { SharedService } from '../../shared/services/shared.service';
import { ChatResponse } from '../../Model/Models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private messageSource = new BehaviorSubject<Message | null>(null);

  // Public observables
  message$ = this.messageSource.asObservable();

  constructor(private sharedService: SharedService ,
    private _http : HttpClient
  ) {}

  // Start connection to SignalR Hub
  startConnection(token: string): Observable<boolean> {
    if (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Disconnected) {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('https://fitnesspro.runasp.net/ChatHub', {
          accessTokenFactory: () => token
        })
        .build();

      // Set up message handlers
      this.setupMessageHandlers();
    }

    return new Observable<boolean>(observer => {
      this.hubConnection.start()
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Set up message handlers
  private setupMessageHandlers(): void {
    // Listen to incoming messages
    this.hubConnection.on('ReceiveMessage', (message: Message) => {
      this.messageSource.next(message);
    });
  }

  // Send message to the SignalR hub
  sendMessage(message: Message): Observable<boolean> {
    return new Observable<boolean>(observer => {
      if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
        observer.error(new Error("Hub connection is not in connected state"));
        return;
      }

      this.hubConnection.invoke('SendMessage', message.receiverId, message.content, message.imageUrl)
        .then(() => {
          observer.next(true);
          observer.complete();
        })
        .catch(err => {
          observer.error(err);
        });
    });
  }

  // Stop connection when no longer needed
  stopConnection(): void {
    if (this.hubConnection && this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      this.hubConnection.stop()
        .catch(err => {
          console.error('Error stopping SignalR connection:', err);
        });
    }
  }

  getAllMessage(UserId : string):Observable<ChatResponse>{
    return this._http.get<ChatResponse>(`${environment.mainurl}/Chat/history/${UserId}?pageNumber=1&pageSize=20`)
  }
}


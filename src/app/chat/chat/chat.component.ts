import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../mainPage/navbar/navbar.component';

export interface Message {
  id?: number;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl: string | null;
  timeStamp: string;
  isSeen?: boolean;
  seenAt?: string | null;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, NavbarComponent,RouterModule],
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  senderId = '';
  receiverId = '';
  isConnected = false;
  isLoading = false;

  contacts: any[] = [];

  @ViewChild('chatBox') chatBox!: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      this.sharedService.show('You need to be logged in to use the chat', 'error');
      return;
    }

    const decodedToken: any = jwtDecode(token);
    this.senderId =
      decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    this.loadContacts();

    const connectionSub = this.chatService.startConnection(token).subscribe({
      next: (connected) => {
        this.isConnected = connected;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.sharedService.show('Failed to connect to chat server', 'error');
      },
    });
    this.subscriptions.push(connectionSub);

    const routeSub = this.activeRoute.paramMap.subscribe((params) => {
      const newReceiverId = params.get('id');
      if (newReceiverId && newReceiverId !== this.receiverId) {
        this.receiverId = newReceiverId;
        this.loadChatHistory();
      }
    });
    this.subscriptions.push(routeSub);

    const messageSub = this.chatService.message$.subscribe((msg) => {
      if (msg) {
        const isBetween =
          (msg.senderId === this.senderId && msg.receiverId === this.receiverId) ||
          (msg.senderId === this.receiverId && msg.receiverId === this.senderId);
        if (isBetween) {
          this.messages.push(msg);
          this.scrollToBottom();
        }
      }
    });
    this.subscriptions.push(messageSub);
  }

  private loadContacts(): void {
    this.chatService.getContact().subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.contacts = res.data;
        }
      },
      error: () => {
        this.sharedService.show('Failed to load contacts', 'error');
      },
    });
  }

  private loadChatHistory(): void {
    this.isLoading = true;
    this.messages = [];

    this.chatService.getAllMessage(this.receiverId).subscribe({
      next: (response) => {
        if (response.isSuccess && response.data) {
          this.messages = response.data.data.filter(
            (msg: { senderId: string; receiverId: string }) =>
              (msg.senderId === this.senderId && msg.receiverId === this.receiverId) ||
              (msg.senderId === this.receiverId && msg.receiverId === this.senderId)
          );
          this.sortMessagesByTimestamp();
          this.scrollToBottom();
        }
        this.isLoading = false;
      },
      error: () => {
        this.sharedService.show('Failed to load chat history', 'error');
        this.isLoading = false;
      },
    });
  }

  private sortMessagesByTimestamp(): void {
    this.messages.sort(
      (a, b) => new Date(a.timeStamp).getTime() - new Date(b.timeStamp).getTime()
    );
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  send(): void {
    if (!this.newMessage.trim() || !this.isConnected) return;

    const message: Message = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      content: this.newMessage,
      imageUrl: null,
      timeStamp: new Date().toISOString(),
    };

    const tempMessage = this.newMessage;
    this.newMessage = '';

    const sendSub = this.chatService.sendMessage(message).subscribe({
      next: () => {
        this.scrollToBottom();
      },
      error: () => {
        this.sharedService.show('Failed to send message', 'error');
        this.newMessage = tempMessage;
      },
    });
    this.subscriptions.push(sendSub);
  }

  openChat(userId: string): void {
    this.router.navigate(['/layout/chat', userId]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.chatService.stopConnection();
  }
}

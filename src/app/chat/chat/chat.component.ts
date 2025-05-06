import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService } from '../service/chat.service';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from '../../shared/services/shared.service';
import { jwtDecode } from 'jwt-decode';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";

export interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl: string | null;
  timeStamp: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] ,
  imports: [FormsModule, CommonModule, NavbarComponent]
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  newMessage = '';
  senderId = '';
  receiverId = '';
  isConnected = false;
  isLoading = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private activeRoute: ActivatedRoute,
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
    this.senderId = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    // Initialize connection
    const connectionSub = this.chatService.startConnection(token).subscribe({
      next: (connected) => {
        this.isConnected = connected;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.sharedService.show('Failed to connect to chat server', 'error');
      }
    });
    this.subscriptions.push(connectionSub);

    // Subscribe to route param changes for receiving new receiverId
    const routeSub = this.activeRoute.paramMap.subscribe(params => {
      const newReceiverId = params.get('id');
      if (newReceiverId && newReceiverId !== this.receiverId) {
        this.receiverId = newReceiverId;
        this.messages = [];
      }
    });
    this.subscriptions.push(routeSub);

    // Listen to incoming messages
    const messageSub = this.chatService.message$.subscribe((msg) => {
      if (msg) {
        const isBetween = (msg.senderId === this.senderId && msg.receiverId === this.receiverId) ||
                          (msg.senderId === this.receiverId && msg.receiverId === this.senderId);
        if (isBetween) {
          this.messages.push(msg);
          this.scrollToBottom();
        }
      }
    });
    this.subscriptions.push(messageSub);
  }

  // Scroll to the bottom of the chat box
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // Send message
send(): void {
  if (!this.newMessage.trim() || !this.isConnected) return;

  const message: Message = {
    senderId: this.senderId,
    receiverId: this.receiverId,
    content: this.newMessage,
    imageUrl: null,
    timeStamp: new Date().toISOString()
  };

  // Clear the input immediately but don't add to messages yet
  const tempMessage = this.newMessage;
  this.newMessage = '';

  const sendSub = this.chatService.sendMessage(message).subscribe({
    next: () => {
      // The message will be added through the message$ subscription
      this.scrollToBottom();
    },
    error: (err) => {
      console.error('Failed to send message:', err);
      this.sharedService.show('Failed to send message', 'error');
      this.newMessage = tempMessage;
    }
  });
  this.subscriptions.push(sendSub);
}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.stopConnection();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { SharedService } from '../../shared/services/shared.service';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";

@Component({
  selector: 'app-chat-user',
  imports: [RouterModule, CommonModule, NavbarComponent],
  templateUrl: './chat-user.component.html',
  styleUrl: './chat-user.component.css'
})
export class ChatUserComponent implements OnInit {
  contacts: any[] = [];
  dataLoaded: boolean = false;
  ifContacts: boolean = false;

  constructor(private chatService: ChatService,private sharedService: SharedService ){

  }

  ngOnInit(): void {
    this.loadContacts();
  }


loadContacts(): void {
  this.chatService.getContact().subscribe({
    next: (res) => {
      this.contacts = res.data || [];
      this.dataLoaded = true;
    },
    error: () => {
      this.dataLoaded = true;
    }
  });
}

}

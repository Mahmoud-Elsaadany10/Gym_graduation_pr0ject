import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";


@Component({
  selector: 'app-coach-dashboard',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './coach-dashboard.component.html',
  styleUrl: './coach-dashboard.component.css'
})
export class CoachDashboardComponent implements OnInit{

  sidebarVisible = false;
  id : string | null = null;
  constructor() { }

  ngOnInit(): void {
    this.id = this.getId();
  }
  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getId(){
  const token = this.getToken()
  if(token){
    const decodedToken: any = jwtDecode(token);
    const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    return id
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { NavbarComponent } from "../../mainPage/navbar/navbar.component";
import { RegistrationService } from '../../Registration/service/registration.service';
import { ProfileService } from '../../profile/service/profile.service';


@Component({
  selector: 'app-coach-dashboard',
  imports: [RouterModule, NavbarComponent],
  templateUrl: './coach-dashboard.component.html',
  styleUrl: './coach-dashboard.component.css'
})
export class CoachDashboardComponent implements OnInit{
  hasGym: boolean = false;
  hasOnlineTraining: boolean = false;
  hasShop: boolean = false;
  isCoach: boolean = false;
  coachImage : string | null = ""

  sidebarVisible = false;
  id : string | null = null;
  constructor(private _check: RegistrationService ,
    private _ProfileService : ProfileService
  ) { }

  ngOnInit(): void {
    this.checkBusiness()
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

    checkBusiness() {
    this._check.getCoachBusiness().subscribe({
      next: (response) => {
        this.hasGym = response.data.hasGym;
        this.hasOnlineTraining = response.data.hasOnlineTrainng;
        this.hasShop = response.data.hasShop;
        this.isCoach = response.isSuccess;
        console.log("Business Check Response:", response);
      }

    });
  }
    getCoachInfo() {
    this._ProfileService.getCoachInfo().subscribe({
      next: (coach) => {


        this.coachImage = coach.profilePictureUrl
          ? coach.profilePictureUrl + '?t=' + new Date().getTime()
          : null;

      },
      error: (err) => {
        console.error('Failed to load profile info:', err);
      }
    });
  }


}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationService } from '../../Registration/service/registration.service';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  isLogged :boolean =false
  isCoach :boolean =false
  constructor(private _Register : RegistrationService
  ){}

  ngOnInit(): void {
    this.islOggedIn()
    this.checkBusiness()
    // this.checheRole()
  }
  islOggedIn(){
    this._Register.userData.subscribe(() =>{
      if(this._Register.userData.getValue() !== null){
        this.isLogged = true
      }else{
        this.isLogged = false
      }
    })

  }
  logout(){
    this._Register.logout()
  }
  // getToken(): string | null {
  //   return localStorage.getItem('token') || sessionStorage.getItem('token');
  // }
  // getRole(){
  // const token = this.getToken()
  // if(token){
  //   const decodedToken: any = jwtDecode(token);
  //   const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  //   return role
  //   }
  // }
  // getId(){
  // const token = this.getToken()
  // if(token){
  //   const decodedToken: any = jwtDecode(token);
  //   const id = decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
  //   return id
  //   }
  // }

  // checheRole(){
  //   if(this.getRole() ==="Coach"){
  //     this.isCoach = true
  //   }else{
  //     this.isCoach =false
  //   }
  // }
  checkBusiness() {
    this._Register.getCoachBusiness().subscribe({
      next: (response) => {
        this.isCoach = response.isSuccess;
        console.log("Business Check Response:", response);
      }
    });
  }



}

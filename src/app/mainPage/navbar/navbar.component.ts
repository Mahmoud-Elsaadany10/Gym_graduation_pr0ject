import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegistrationService } from '../../Registration/service/registration.service';


@Component({
  selector: 'app-navbar',
  imports: [RouterModule,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  expression :boolean =false
  constructor(private _Register : RegistrationService){}

  ngOnInit(): void {
    this.islOggedIn()
  }
  islOggedIn(){
    this._Register.userData.subscribe(() =>{
      if(this._Register.userData.getValue() !== null){
        this.expression = true
      }else{
        this.expression = false
      }
    })

  }
  logout(){
    this._Register.logout()
  }



}

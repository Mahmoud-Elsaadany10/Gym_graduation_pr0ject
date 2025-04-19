import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { loginResponse, loginUser } from '../../Model/Models';
import { RegistrationService } from '../service/registration.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule ,RouterModule,FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm !:FormGroup
  whichRole :string =""
  rememberMe : boolean =true

  constructor(private fbulider: FormBuilder,  private router: Router ,
    private sendToBackend : RegistrationService
  ){
    this.loginForm = this.fbulider.group({
      email: ['',[Validators.required , Validators.email]],
      password: ['',[Validators.required , Validators.minLength(6)]]

    });

  }

  get email() {
    return this.loginForm.get('email');
  }


  get password() {
    return this.loginForm.get('password');
  }
  routeToSignup(){
    this.router.navigate(['Logging/user'])
  }
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  getRole(){
  const token = this.getToken()
  if(token){
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role
  }
  }

  login(){
    const userLogin : loginUser ={...this.loginForm.value}
    console.log(userLogin)
    this.sendToBackend.login(userLogin,this.rememberMe).subscribe((response : loginResponse)=>{
      if(response.isSuccess){
        if(this.getRole() == "Coach"){
          this.router.navigate(["/logging/gymInfo"])
        }else{
          this.router.navigate(["/layout/home"])
        }

    }})
  }


}

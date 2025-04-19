import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../service/registration.service';

@Component({
  selector: 'app-forget-password',
  imports: [RouterModule ,FormsModule,ReactiveFormsModule ,CommonModule],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  emailForm !:FormGroup

  constructor(private fbulider: FormBuilder , private router :Router ,
    private _ForgetPasswordService :RegistrationService
  ){
    this.emailForm =this.fbulider.group({
      email: ['',[Validators.required , Validators.email]]
    })
  }

  get email(){
    return this.emailForm.get("email")
  }


  sendEmail() {
    if (this.emailForm.invalid) {
      return;
    }
    const email = this.emailForm.value.email;
    sessionStorage.setItem('emailPassword', email);
    console.log(email) // Store email for later

    this._ForgetPasswordService.forgetPassword(email).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/logging/VerifyCode']);
        }
      },
    });
  }

}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgOtpInputComponent, NgOtpInputConfig } from 'ng-otp-input';
import { RegistrationService } from '../service/registration.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-verify-email',
  imports: [CommonModule,ReactiveFormsModule,FormsModule ,RouterModule ,NgOtpInputComponent ,NgbToastModule ],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent {
  email: string = sessionStorage.getItem("email") || '';
  otp: string = "";
  showOtpComponent = true;
  isTrue:boolean = false;

  otpConfig: NgOtpInputConfig = {
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    allowNumbersOnly: true,
    inputStyles: {
      width: "30px",
      height: "30px",
      borderRadius: "5px",
      fontSize: "20px",
      border: "1px solid #2C3552",
    },
  };
  toastMessage: string ='';
  showToast: boolean =false;

  constructor(private verfication :RegistrationService ,
    private router: Router
  ){}


  onOtpChange(otp: string) {
    this.otp = otp;
    console.log("Entered OTP:", this.otp);
  }

  submitOtp() {
    this.verfication.confirmEmail({email:this.email ,verificationCode:this.otp}).subscribe((response)=>{
    if (response.isSuccess) {
      this.router.navigate(['/logging/login'])
      this.isTrue =false
    }else if(response.isSuccess == false){
      this.isTrue =true
      this.otpConfig = {
        ...this.otpConfig,
        inputStyles: {
          ...this.otpConfig.inputStyles,
          borderColor: "#ff000063",
          backgroundColor: "#ff000063",
        }
      };
    }
    },(error)=>{
      this.isTrue =true
      this.otpConfig = {
        ...this.otpConfig,
        inputStyles: {
          ...this.otpConfig.inputStyles,
          borderColor: "#ff000063",
          backgroundColor: "#ff000063",
        }
      };
    })
  }

  resendOtp() {
    this.verfication.resenConfirmationCode(this.email).subscribe((response)=>{
      if (response.isSuccess) {
        this.isTrue =false
        this.toastMessage = `Verification code sent.`;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }else {
        this.isTrue =true
      }
    })
  }
}


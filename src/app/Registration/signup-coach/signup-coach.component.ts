import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../rout-sign-up/rout-sign-up.component";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../service/registration.service';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';

@Component({
  selector: 'app-signup-coach',
  imports: [RoutSignUpComponent,ReactiveFormsModule, CommonModule ,RouterModule ,NgbModule,NgbToastModule],
  templateUrl: './signup-coach.component.html',
  styleUrl: './signup-coach.component.css'
})
export class SignupCoachComponent {

    signupForCoach!: FormGroup;
  showToast: boolean = false;
  toastMessage: string ="";

    constructor(private router: Router, private fbulider: FormBuilder ,
      private sendToBackend : RegistrationService
    ) {
      this.signupForCoach = this.fbulider.group({
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6) ,strongPasswordValidator]],
        confirmPassword: ['', [Validators.required]],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required]
      }, { validator: passwordMatchValidator });
    }




    get firstName() {
      return this.signupForCoach.get('firstName');
    }

    get lastName() {
      return this.signupForCoach.get('lastName');
    }

    get email() {
      return this.signupForCoach.get('email');
    }

    get password() {
      return this.signupForCoach.get('password');
    }

    get confirmPassword() {
      return this.signupForCoach.get('confirmPassword');
    }

    get gender() {
      return this.signupForCoach.get('gender');
    }

    get dateOfBirth() {
      return this.signupForCoach.get('dateOfBirth');
    }
    openDatePicker(data :HTMLInputElement){
      data.showPicker()
    }
    signup(){
      const RegCoach ={...this.signupForCoach.value}
      if (RegCoach.dateOfBirth && typeof RegCoach.dateOfBirth === 'object') {
        const { year, month, day } = RegCoach.dateOfBirth;
        RegCoach.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      }
      delete RegCoach.confirmPassword
      console.log(RegCoach)
      this.sendToBackend.singupCoach(RegCoach).subscribe({
        next : (response ) => {
          if(response.isSuccess){
            this.router.navigate(['/logging/verifyEmail'])
            sessionStorage.setItem('email', RegCoach.email)
          }
        },
        error : (err) => {
          console.error('Error fetching coaches:', err)}
      })

    }
}

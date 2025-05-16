import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RegistrationService } from '../service/registration.service';
import { ApiResponse } from '../../Model/Models';
import { SharedService } from '../../shared/services/shared.service';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoutSignUpComponent } from "../rout-sign-up/rout-sign-up.component";


@Component({
  selector: 'app-signup-user',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, NgbToastModule, NgbModule, RoutSignUpComponent],
  templateUrl: './signup-user.component.html',
  styleUrl: './signup-user.component.css'
})
export class SignupUserComponent {

  signupForUser!: FormGroup;
  Email : string  = ''
  showToast: boolean= false;
  toastMessage :string = ''
  selectedDate: string = '';
  formattedDate: string = '';

  constructor(private router: Router,
    private fbulider: FormBuilder

    ,private sendToBackend : RegistrationService
  ) {
    this.signupForUser = this.fbulider.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6) , strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    }, { validator: passwordMatchValidator });
  }




  get firstName() {
    return this.signupForUser.get('firstName');
  }

  get lastName() {
    return this.signupForUser.get('lastName');
  }

  get email() {
    return this.signupForUser.get('email');
  }

  get password() {
    return this.signupForUser.get('password');
  }

  get confirmPassword() {
    return this.signupForUser.get('confirmPassword');
  }

  get gender() {
    return this.signupForUser.get('gender');
  }

  get dateOfBirth() {
    return this.signupForUser.get('dateOfBirth');
  }
  openDatePicker(dateInput: HTMLInputElement) {
    dateInput.showPicker();
  }

  signup(){
    const RegUser ={...this.signupForUser.value}
    delete RegUser.confirmPassword
    if (RegUser.dateOfBirth && typeof RegUser.dateOfBirth === 'object') {
      const { year, month, day } = RegUser.dateOfBirth;
      RegUser.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    console.log(RegUser)
    console.log(RegUser.email)
    this.sendToBackend.signupTrainee(RegUser).subscribe({
      next : (response ) => {
        if(response.isSuccess){
          this.router.navigate(['/logging/verifyEmail'])
          sessionStorage.setItem('email', RegUser.email)
        }
      },
      error : (err) => {
        console.error('Error fetching coaches:', err)}
    })

  }
}


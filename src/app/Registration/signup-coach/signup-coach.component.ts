import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../rout-sign-up/rout-sign-up.component";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../service/registration.service';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

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
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        bio:['this is trainee']
      }, { validator: this.passwordMatchValidator });
    }

    // Custom Validator: Check if password and confirmPassword match
    passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      if (password && confirmPassword) {
        return password === confirmPassword ? null : { passwordsMismatch: true };
      }

      return null;
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

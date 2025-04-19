import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegistrationService } from '../service/registration.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-reset-password',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  changePasswordForm!: FormGroup;

  constructor(private fbulider: FormBuilder, private router: Router ,
    private _ResetPassword :RegistrationService
  ) {
    this.changePasswordForm = this.fbulider.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },{validator:this.passwordMatch});
  }
  passwordMatch(group :AbstractControl):ValidationErrors | null{
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if(newPassword && confirmPassword){
      return newPassword === confirmPassword ? null :{passwordsMismatch:true};
    }else{
      return null;
    }

  }

  get newPassword() {
    return this.changePasswordForm.get("newPassword");
  }

  get confirmPassword() {
    return this.changePasswordForm.get("confirmPassword");
  }

  ResetPassword() {
    const email = sessionStorage.getItem('emailPassword');
    if (!email) {
      console.error('Error: Email not found in session storage.');
      return;
    }

    let model = {
      newPassword: this.changePasswordForm.value.newPassword,
      confirmPassword: this.changePasswordForm.value.confirmPassword,
      email: email
    };

    this._ResetPassword.ResetPassword(model).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.router.navigate(['/logging/Done']);
        } else {
          console.error('Error: Reset failed', response);
        }
      },
      error: (err) => console.error('API Error:', err)
    });
  }

}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../service/profile.service';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule ,CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  passwordForm : FormGroup;

  constructor(public activeModal: NgbActiveModal, private fb: FormBuilder ,
    private _changePassword : ProfileService ,
    private toastService: SharedService) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required ,strongPasswordValidator ,Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },{ validator: passwordMatchValidator });
  }

  get oldPassword() {
    return this.passwordForm.get('oldPassword');
  }

  get newPassword() {
    return this.passwordForm.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }


  submit() {
    if (this.passwordForm.valid) {
      this._changePassword.changePassword(this.passwordForm.value).subscribe({
        next :()=>{
      console.log(this.passwordForm.value);
      this.activeModal.close(this.passwordForm.value);
      this.toastService.show("all Done", "light");

        }
      })


    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}

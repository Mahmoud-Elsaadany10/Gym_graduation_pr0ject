import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { RegistrationService } from '../service/registration.service';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';
import { SetRoleComponent } from '../set-role/set-role.component';
import { RoutSignUpComponent } from "../rout-sign-up/rout-sign-up.component";

declare const google: any;

@Component({
  selector: 'app-signup-user',
  templateUrl: './signup-user.component.html',
  styleUrls: ['./signup-user.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbToastModule,
    NgbModule,
    RoutSignUpComponent
]
})
export class SignupUserComponent implements OnInit, AfterViewInit {
  signupForUser!: FormGroup;

  private tokenClient: any;
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private modalService: NgbModal,
    private registrationService: RegistrationService
  ) {
    this.buildForm();
  }

  ngOnInit(): void {
    // no Google logic here
  }

  ngAfterViewInit(): void {
    this.loadGoogleApi();
  }

  private buildForm(): void {
    this.signupForUser = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    }, { validators: passwordMatchValidator });
  }

  get firstName() { return this.signupForUser.get('firstName'); }
  get lastName() { return this.signupForUser.get('lastName'); }
  get email() { return this.signupForUser.get('email'); }
  get password() { return this.signupForUser.get('password'); }
  get confirmPassword() { return this.signupForUser.get('confirmPassword'); }
  get gender() { return this.signupForUser.get('gender'); }
  get dateOfBirth() { return this.signupForUser.get('dateOfBirth'); }

  openDatePicker(input: HTMLInputElement): void {
    input.showPicker();
  }

  signup(): void {
    if (this.signupForUser.invalid) return;

    const formData = { ...this.signupForUser.value };
    delete formData.confirmPassword;

    if (typeof formData.dateOfBirth === 'object') {
      const { year, month, day } = formData.dateOfBirth;
      formData.dateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    this.registrationService.signupTrainee(formData).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          sessionStorage.setItem('email', formData.email);
          this.router.navigate(['/logging/verifyEmail']);
        }
      },
      error: err => console.error('Signup error:', err)
    });
  }

  private loadGoogleApi(): void {
    if (typeof google !== 'undefined' && google.accounts) {
      this.initGoogleAuth();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => this.initGoogleAuth();
    script.onerror = () => console.error('Failed to load Google API');
    document.body.appendChild(script);
  }

  private initGoogleAuth(): void {
    // Initialize button for ID token
    google.accounts.id.initialize({
      client_id: this.clientId,
      callback: this.handleCredentialResponse.bind(this)
    });

    const div = document.getElementById('googleSignInDiv');
    if (div) {
      google.accounts.id.renderButton(div, {
        theme: 'outline',
        size: 'large'
      });
    }

    // Initialize token client for access token
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: this.clientId,
      scope: 'openid email profile',
      callback: (tokenResponse: any) => {
        if (tokenResponse?.access_token) {
          this.handleGoogleAccessToken(tokenResponse.access_token);
        } else {
          console.error('No access_token in token response');
        }
      },
      ux_mode: 'popup'
    });
  }

  handleGoogleLogin(): void {
    if (!this.tokenClient) {
      console.warn('Google token client not initialized.');
      return;
    }
    this.tokenClient.requestAccessToken({ prompt: 'consent' });
  }

  private handleCredentialResponse(response: any): void {
    const idToken = response.credential;
    const accessToken = sessionStorage.getItem('googleAccessToken');

    if (!accessToken) {
      console.warn('No access token available. Please click "Continue with Google" again.');
      return;
    }

    this.sendTokensToApi(idToken, accessToken);
  }

  private handleGoogleAccessToken(accessToken: string): void {
    sessionStorage.setItem('googleAccessToken', accessToken);
    google.accounts.id.prompt(); // prompts the user to sign in and trigger ID token
  }

  private sendTokensToApi(idToken: string, accessToken: string): void {
    this.http.post('https://fitnesspro.runasp.net/api/Account/GoogleLogin', {
      idToken,
      accessToken
    }).subscribe({
      next: () => {
        sessionStorage.removeItem('googleAccessToken');
        this.openConfirmModal();

      },
      error: err => {
        console.error('Google login API error:', err);
        sessionStorage.removeItem('googleAccessToken');
      }
    });
  }

  private openConfirmModal(): void {
    this.modalService.open(SetRoleComponent, {
      windowClass: 'medium-top-modal',
      backdrop: 'static',
      keyboard: false
    });
  }
}

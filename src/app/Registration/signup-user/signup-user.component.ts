import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

import { RegistrationService } from '../service/registration.service';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';
import { RoutSignUpComponent } from '../rout-sign-up/rout-sign-up.component';
import { SetRoleComponent } from '../set-role/set-role.component';

declare const google: any;

@Component({
  selector: 'app-signup-user',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
export class SignupUserComponent implements OnInit {
  signupForUser!: FormGroup;
  private accessToken: string = '';
  private tokenClient: any;
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';
  private isProcessingAuth = false;
  private googleAuthInitialized = false;

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
    if (this.googleAuthInitialized || typeof google === 'undefined') return;

    try {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        ux_mode: 'popup',
        cancel_on_tap_outside: true,
        auto_select: false,
        itp_support: true,
        use_fedcm_for_prompt: false
      });

      this.tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'openid email profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
        callback: (tokenResponse: any) => {
          if (tokenResponse?.access_token) {
            this.accessToken = tokenResponse.access_token;
            sessionStorage.setItem('googleAccessToken', this.accessToken);
          }
        }
      });

      this.googleAuthInitialized = true;
    } catch (err) {
      console.error('Google auth initialization error:', err);
    }
  }

  handleGoogleLogin(): void {
    if (this.isProcessingAuth || !this.googleAuthInitialized) {
      if (!this.googleAuthInitialized) this.loadGoogleApi();
      return;
    }

    this.isProcessingAuth = true;

    this.tokenClient.requestAccessToken({ prompt: 'consent' });

    setTimeout(() => {
      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn('Google prompt not displayed:', notification.getNotDisplayedReason());
          this.useAlternativeGoogleAuth();
        } else if (notification.isSkippedMoment() || notification.isDismissedMoment()) {
          console.warn('Google prompt was skipped/dismissed:', notification.getSkippedReason() || notification.getDismissedReason());
        }
        this.isProcessingAuth = false;
      });
    }, 500);
  }

  private useAlternativeGoogleAuth(): void {
    try {
      const authWindow = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.clientId}&redirect_uri=${encodeURIComponent(window.location.origin)}&response_type=token&scope=${encodeURIComponent('openid email profile')}`,
        'googleAuthPopup',
        'width=500,height=600'
      );

      window.addEventListener('message', (event) => {
        if (event.origin === window.location.origin && event.data.type === 'googleAuthCallback') {
          this.fetchUserInfoAndIdToken(event.data.token);
        }
      }, { once: true });

    } catch (error) {
      console.error('Alternative Google auth failed:', error);
    }
  }

  private fetchUserInfoAndIdToken(token: string): void {
    fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`)
      .then(res => res.json())
      .then(data => this.processGoogleTokens(data.id_token || '', token))
      .catch(err => console.error('Failed to fetch ID token:', err));
  }

  private processGoogleTokens(idToken: string, accessToken: string): void {
    this.http.post('https://fitnesspro.runasp.net/api/Account/GoogleLogin', {
      idToken, accessToken
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

  handleCredentialResponse(response: any): void {
    if (!response?.credential) return;

    const idToken = response.credential;
    const accessToken = sessionStorage.getItem('googleAccessToken') || '';

    this.processGoogleTokens(idToken, accessToken);
  }

  private openConfirmModal(): void {
    this.modalService.open(SetRoleComponent, {
      windowClass: 'medium-top-modal',
      backdrop: 'static',
      keyboard: false
    });
  }
}

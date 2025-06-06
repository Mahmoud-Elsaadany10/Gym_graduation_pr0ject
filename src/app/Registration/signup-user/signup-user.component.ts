// CLEAN Google Auth Implementation - Replace your entire Google auth logic

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignupUserComponent implements OnInit, AfterViewInit {
  signupForUser!: FormGroup;
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';
  private isGoogleApiLoaded = false;

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
    // Clean initialization
  }

  ngAfterViewInit(): void {
    // Load Google API after a short delay
    setTimeout(() => {
      this.loadGoogleApiClean();
    }, 500);
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

  // CLEAN Google API Loading
  private loadGoogleApiClean(): void {
    // Remove existing script if any
    const existingScript = document.querySelector('script[src*="accounts.google.com"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Check if already loaded
    if (typeof google !== 'undefined' && google.accounts) {
      this.initGoogleAuthClean();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {

      // Wait for API to be fully ready
      setTimeout(() => {
        this.initGoogleAuthClean();
      }, 1000);
    };

    script.onerror = () => {
      console.error('❌ Failed to load Google API');
    };

    document.head.appendChild(script);
  }

  // CLEAN Google Auth Initialization
  private initGoogleAuthClean(): void {
    try {
      if (!google?.accounts?.oauth2) {
        console.error('❌ Google OAuth2 API not available');
        return;
      }

      // ONLY use OAuth2 - no Sign-In ID to avoid conflicts
      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: this.clientId,
        scope: 'openid email profile',
        ux_mode: 'popup',
        callback: this.handleTokenResponse.bind(this),
        error_callback: this.handleTokenError.bind(this)
      });

      // Store globally for access
      (window as any).googleTokenClient = tokenClient;
      this.isGoogleApiLoaded = true;
    } catch (error) {
      console.error('❌ Error initializing Google OAuth2:', error);
    }
  }

  // CLEAN Google Login Handler
  handleGoogleLogin(): void {

    if (!this.isGoogleApiLoaded) {
      console.warn('⚠️ Google API not ready, loading...');
      this.loadGoogleApiClean();
      return;
    }

    const tokenClient = (window as any).googleTokenClient;
    if (!tokenClient) {
      console.error('❌ Token client not available');
      return;
    }

    try {

      tokenClient.requestAccessToken({
        prompt: 'select_account consent'
      });
    } catch (error) {
      console.error('❌ Error requesting token:', error);
    }
  }

  private handleTokenResponse(response: any): void {


    if (!response.access_token) {
      console.error('❌ No access token in response');
      return;
    }

    const accessToken = response.access_token;


    this.getUserInfoAndSendToBackend(accessToken);
  }


  private handleTokenError(error: any): void {
    console.error('❌ Token error:', error);
  }


  private getUserInfoAndSendToBackend(accessToken: string): void {

    const userInfoUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;

    this.http.get(userInfoUrl).subscribe({
      next: (userInfo: any) => {

        const idTokenPayload = {
          iss: 'https://accounts.google.com',
          aud: this.clientId,
          sub: userInfo.id,
          email: userInfo.email,
          email_verified: userInfo.verified_email || true,
          name: userInfo.name,
          picture: userInfo.picture,
          given_name: userInfo.given_name,
          family_name: userInfo.family_name,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 3600
        };

        const idToken = btoa(JSON.stringify(idTokenPayload));

        this.sendToBackend(idToken, accessToken);
      },
      error: (error) => {
        console.error('❌ Error getting user info:', error);
      }
    });
  }

  // Send tokens to backend
  sendToBackend(idToken: string, accessToken: string): void {
    const payload = { idToken, accessToken };
    this.registrationService.googleLogin(payload).subscribe({
      next: (response) => {

      },
      error: (error) => {
        console.error('❌ Backend error:', error);
      }
    });
  }

}




import { Component } from '@angular/core';
import { RoutSignUpComponent } from "../rout-sign-up/rout-sign-up.component";
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../service/registration.service';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { passwordMatchValidator, strongPasswordValidator } from '../../core/custom/passwordCheck';
import { HttpClient } from '@angular/common/http';

declare const google: any;
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
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';
  private isGoogleApiLoaded = false;

    constructor(private router: Router, private fbulider: FormBuilder ,
      private sendToBackend : RegistrationService ,
      private http : HttpClient
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
      // Request access token
      tokenClient.requestAccessToken({
        prompt: 'select_account consent'
      });
    } catch (error) {
      console.error('❌ Error requesting token:', error);
    }
  }
    // Handle successful token response
  private handleTokenResponse(response: any): void {

    if (!response.access_token) {

      return;
    }

    const accessToken = response.access_token;
    this.getUserInfoAndSendToBackend(accessToken);
  }

  // Handle token errors
  private handleTokenError(error: any): void {
    console.error('❌ Token error:', error);
  }

  // Get user info and send to backend
  private getUserInfoAndSendToBackend(accessToken: string): void {
    // Get user profile from Google
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

        // Create simple ID token (base64 encoded)
        const idToken = btoa(JSON.stringify(idTokenPayload));


        // Send to backend
        this.sendToBack(idToken, accessToken);
      },
      error: (error) => {
        console.error('❌ Error getting user info:', error);
      }
    });
  }
  sendToBack(idToken: string, accessToken: string): void {
    const payload = { idToken, accessToken };
    this.sendToBackend.googleLogin(payload).subscribe({
      next: (response) => {

      },
      error: (error) => {
        console.error('❌ Backend error:', error);
      }
    });
  }
}

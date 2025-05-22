import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { loginResponse, loginUser } from '../../Model/Models';
import { RegistrationService } from '../service/registration.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';

declare const google: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule ,RouterModule,FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit , AfterViewInit {
  loginForm !:FormGroup
  whichRole :string =""
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';
  private isGoogleApiLoaded = false;
  rememberMe : boolean =true

  constructor(private fbulider: FormBuilder,  private router: Router ,
    private sendToBackend : RegistrationService ,
    private http: HttpClient
  ){
    this.loginForm = this.fbulider.group({
      email: ['',[Validators.required , Validators.email]],
      password: ['',[Validators.required , Validators.minLength(6)]]

    });

  }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    // Load Google API after a short delay
    setTimeout(() => {
      this.loadGoogleApiClean();
    }, 500);
  }

  get email() {
    return this.loginForm.get('email');
  }


  get password() {
    return this.loginForm.get('password');
  }
  routeToSignup(){
    this.router.navigate(['Logging/user'])
  }
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }
  getRole(){
  const token = this.getToken()
  if(token){
    const decodedToken: any = jwtDecode(token);
    const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role
  }
  }

  login(){
    const userLogin : loginUser ={...this.loginForm.value}
    console.log(userLogin)
    this.sendToBackend.login(userLogin,this.rememberMe).subscribe((response : loginResponse)=>{
      if(response.isSuccess){
        if(this.getRole() == "Coach"){
          this.router.navigate(["/logging/gymInfo"])
        }else{
          this.router.navigate(["/layout/home"])
        }

    }})
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
      console.log('✅ Google API loaded successfully');
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

      console.log('✅ Google OAuth2 initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Google OAuth2:', error);
    }
  }

  // CLEAN Google Login Handler
  handleGoogleLogin(): void {
    console.log('🔐 Starting Google login...');

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
    console.log('🎉 Token received:', response);

    if (!response.access_token) {
      console.error('❌ No access token in response');
      return;
    }

    const accessToken = response.access_token;
    console.log('✅ Access token:', accessToken.substring(0, 20) + '...');

    // Get user info to create ID token
    this.getUserInfoAndSendToBackend(accessToken);
  }

    private handleTokenError(error: any): void {
    console.error('❌ Token error:', error);
  }

  // Get user info and send to backend
  private getUserInfoAndSendToBackend(accessToken: string): void {
    // Get user profile from Google
    const userInfoUrl = `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`;

    this.http.get(userInfoUrl).subscribe({
      next: (userInfo: any) => {
        console.log('👤 User info:', userInfo);

        // Create ID token (simplified JWT format)
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
        console.log('✅ ID token:', idToken.toString());

        // Send to backend
        this.LogInGoogle(idToken, accessToken);
      },
      error: (error) => {
        console.error('❌ Error getting user info:', error);
      }
    });
  }

  LogInGoogle(idToken: string, accessToken: string): void {
    const payload = { idToken, accessToken };
    this.sendToBackend.googleLogin(payload).subscribe({
      next: (response) => {
        console.log('✅ Backend response:', response);
        sessionStorage.setItem('checktoken', response.data.checktoken);
      },
      error: (error) => {
        console.error('❌ Backend error:', error);
      }
    });
  }


}

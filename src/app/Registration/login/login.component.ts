import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { loginResponse, loginUser } from '../../Model/Models';
import { RegistrationService } from '../service/registration.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { switchMap, of } from 'rxjs';

declare const google: any;
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule ,RouterModule,FormsModule ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit  {
  loginForm !:FormGroup
  whichRole :string =""
  private readonly clientId = '611861831803-tkbkdcm2908ks6g8e5vobq5t2a8o4tu1.apps.googleusercontent.com';
  private isGoogleApiLoaded = false;
  rememberMe : boolean =true
  hasGym : boolean = false;
  hasOnlineTrainng : boolean = false;
  hasShop : boolean = false;
  isCoach :boolean=false

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

  getCoachInfo(){
    this.sendToBackend.getCoachBusiness().subscribe({
      next: (response) => {
        this.hasGym = response.data.hasGym;
        this.hasOnlineTrainng = response.data.hasOnlineTrainng;
        this.hasShop = response.data.hasShop;
        this.isCoach=response.isSuccess
      }
    })
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


login() {
  const userLogin: loginUser = { ...this.loginForm.value };

  this.sendToBackend.login(userLogin, this.rememberMe).pipe(
    switchMap((response: loginResponse) => {
      if (response.isSuccess) {

        return this.sendToBackend.getCoachBusiness();
      } else {

        return of(null);
      }
    })
  ).subscribe({
    next: (featuresResponse) => {
      if (!featuresResponse) return;

      this.hasGym = featuresResponse.data.hasGym;
      this.hasOnlineTrainng = featuresResponse.data.hasOnlineTrainng;
      this.hasShop = featuresResponse.data.hasShop;
      this.isCoach = true;


      if (this.isCoach && !this.hasGym && !this.hasOnlineTrainng && !this.hasShop) {
        this.router.navigate(["/logging/gymInfo"]);
      } else if (this.isCoach && this.hasGym && !this.hasOnlineTrainng) {
        this.router.navigate(["/logging/traningInfo"]);
      } else if (this.isCoach && this.hasGym && this.hasOnlineTrainng && !this.hasShop) {
        this.router.navigate(["/logging/shopInfo"]);
      } else {
        this.router.navigate(["/layout/home"]);
      }
    },
    error: (err) => {
      console.error("Error during login or business fetch:", err);
    }
  });
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

  private initGoogleAuthClean(): void {
    try {
      if (!google?.accounts?.oauth2) {
        console.error('❌ Google OAuth2 API not available');
        return;
      }

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

  private handleTokenResponse(response: any): void {

    if (!response.access_token) {

      return;
    }

    const accessToken = response.access_token;


    // Get user info to create ID token
    this.getUserInfoAndSendToBackend(accessToken);
  }

    private handleTokenError(error: any): void {
    console.error('❌ Token error:', error);
  }


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


        const idToken = btoa(JSON.stringify(idTokenPayload));

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

        sessionStorage.setItem('checktoken', response.data.checktoken);
      },
      error: (error) => {
        console.error('❌ Backend error:', error);
      }
    });
  }


}

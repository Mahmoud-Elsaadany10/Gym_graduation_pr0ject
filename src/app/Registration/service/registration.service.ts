import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ApiResponse, featuresResponse, GoogleAuthTokens, googleTokenResponse, loginResponse, ResetPasswordModel, TokenResponse, User, VerificationModel } from '../../Model/Models';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login'
import { SetRoleComponent } from '../set-role/set-role.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  userData = new BehaviorSubject<any>(null);
  hasGym :boolean =false
  hasShop :boolean = false
  hasOnlineTrainng :boolean = false
  isCoach :boolean = false

  constructor(private _http :HttpClient , private router : Router ,
    private socialAuthService: SocialAuthService ,
      private modalService: NgbModal
  ) {
    if (localStorage.getItem('token') || sessionStorage.getItem("token")) {
      this.saveUser();
    }
    this.getCoachBusiness()
  }

  signupTrainee(tarinee :User):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/RegisterTrainee` ,tarinee)
  }
  singupCoach(coach :User):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/RegisterCoach` ,coach)
  }

  confirmEmail(data :VerificationModel):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/confirmemail`, data)
  }
  resenConfirmationCode(email :string):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/resend-Confirmation-code` ,JSON.stringify(email) ,
  {
    headers: { 'Content-Type': 'application/json' }
  })
  }

  confirmPasswordCode(data :VerificationModel):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/verifyResetCode`, data)
  }

  resendCodePassword(email :string):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/resend-reset-password-code`,   JSON.stringify(email),
    {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  forgetPassword(email :string):Observable<ApiResponse>{
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/ForgetPassword` ,
      JSON.stringify(email),
    {
      headers: { 'Content-Type': 'application/json' }
    }
    )

  }

  ResetPassword(data: ResetPasswordModel): Observable<ApiResponse> {
    const tokenForResetPassword = sessionStorage.getItem('data') || '';
    if (!tokenForResetPassword) {
      console.error('Error: No token found in session storage.');
      return new Observable<ApiResponse>();
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${tokenForResetPassword}`
    });
    return this._http.post<ApiResponse>(`${environment.mainurl}/Account/ResetPassword`, data, { headers });
  }


  private saveUser() {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        console.log('Decoded Token:', decodedToken);
        this.userData.next(decodedToken);
        // console.log('Decoded User Data:', decodedToken);
      } catch (error) {
        console.error('Invalid token:', error);
        this.logout();
      }
    }
  }

  login(data: { email: string; password: string }, rememberMe: boolean): Observable<loginResponse> {
    return this._http.post<loginResponse>(`${environment.mainurl}/Account/login`, data).pipe(
      map((res: loginResponse) => {
        if (res.isSuccess && res.data.token && res.data.refreshToken) {
          if (rememberMe) {
            this.setTokens(res.data.token, res.data.refreshToken);
          } else {
            this.setSessionTokens(res.data.token, res.data.refreshToken);
          }
          this.saveUser();
        }
        return res;
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please check your credentials.'));
      })
    );
  }


  setTokens(token: string, refreshToken: string): void {
    if (token && refreshToken) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  setSessionTokens(token: string, refreshToken: string): void {
    if (token && refreshToken) {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
  }
  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;
    try {
      const decodedToken: any = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedToken.exp < currentTime;
    } catch (error) {
      console.error('Token decoding error:', error);
      return true;
    }
  }
  logout() {
    localStorage.removeItem('token');
    this.userData.next(null);
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');

  }
  refreshToken(): Observable<string> {
  const refreshToken = this.getRefreshToken();
  if (!refreshToken) {
    this.logout();
    return throwError(() => new Error('No refresh token found.'));
  }

  try {
    const decoded: any = jwtDecode(refreshToken);
    const now = Date.now() / 1000;
    if (decoded.exp < now) {
      this.logout();
      return throwError(() => new Error('Refresh token expired.'));
    }
  } catch (e) {
    this.logout();
    return throwError(() => new Error('Invalid refresh token.'));
  }

  return this._http.post<TokenResponse>(`${environment.mainurl}/Account/RefreshToken`, { refreshToken }).pipe(
      map((response: TokenResponse) => {
        if (response.token && response.refreshToken) {
          if (localStorage.getItem('refreshToken')) {
            this.setTokens(response.token, response.refreshToken);
          } else {
            this.setSessionTokens(response.token, response.refreshToken);
          }
          return response.token;
        }
        throw new Error('Failed to refresh token.');
      }),
      catchError((error) => {
        console.error('Refresh token error:', error);
        alert('Session expired. Please log in again.');
        this.logout();
        return throwError(() => new Error('Refresh token expired. Please log in again.'));
      })
    );
  }


  setRole(Role :{role: string}): Observable<loginResponse> {
    const token = sessionStorage.getItem('checktoken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this._http.post<loginResponse>(`${environment.mainurl}/Account/SetUserRole`, Role, { headers }).pipe(
      map((res: loginResponse) => {
        if (res.isSuccess && res.data.token && res.data.refreshToken) {
          this.setTokens(res.data.token, res.data.refreshToken);
          this.saveUser();
        }
        return res;
      }),
      catchError((error) => {
        console.error('Set role error:', error);
        return throwError(() => new Error('Failed to set role.'));
      })
    )
  }
googleLogin(payload: GoogleAuthTokens): Observable<any> {
  return this._http.post<any>(`${environment.mainurl}/Account/GoogleLogin`, payload).pipe(
    switchMap((res: googleTokenResponse) => {
      if (res.isSuccess && res.data.token && res.data.refreshToken) {
        this.setTokens(res.data.token, res.data.refreshToken);
        this.saveUser();

        // Check if user is a coach
        return this.getCoachBusiness().pipe(
          tap((featuresResponse) => {
            if (featuresResponse?.isSuccess === false || !featuresResponse) {
              this.router.navigate(['/layout/home']);
              return;
            }

            // this.router.navigate(['/layout/home']);



            this.hasGym = featuresResponse.data.hasGym;
            this.hasOnlineTrainng = featuresResponse.data.hasOnlineTrainng;
            this.hasShop = featuresResponse.data.hasShop;
            this.isCoach = true;

            const key = `${+this.hasGym}${+this.hasOnlineTrainng}${+this.hasShop}`;
            const routeMap: Record<string, string> = {
              '000': '/logging/gymInfo',
              '001': '/logging/gymInfo',
              '011': '/logging/gymInfo',
              '010': '/logging/gymInfo',
              '100': '/logging/traningInfo',
              '101': '/logging/traningInfo',
              '110': '/logging/shopInfo',
              '111': '/layout/home'
            };

            this.router.navigate([routeMap[key]]);
          })
        );
      } else if (res.data.checktoken) {
        this.openConfirmModal();
        sessionStorage.setItem('checktoken', res.data.checktoken);
        return of(res);
      } else {
        this.router.navigate(['/layout/home']);
        return of(res);
      }
    }),
    catchError((error) => {
      console.error('Google login error:', error);
      return throwError(() => new Error('Google login failed.'));
    })
  );
}


    private openConfirmModal(): void {
      this.modalService.open(SetRoleComponent, {
        windowClass: 'centered-modal',
        backdrop: 'static',
        keyboard: false
      });
    }

  getCoachBusiness():Observable<featuresResponse> {
    return this._http.get<featuresResponse>(`${environment.mainurl}/User/check-coach-business`,
      { headers: { 'X-Skip-Error': 'true' } })
  }
}


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { ApiResponse, loginResponse, ResetPasswordModel, TokenResponse, User, VerificationModel } from '../../Model/Models';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  userData = new BehaviorSubject<any>(null);

  constructor(private _http :HttpClient) {
    if (localStorage.getItem('token') || sessionStorage.getItem("token")) {
      this.saveUser();
    }
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
        console.log('Decoded User Data:', decodedToken);
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

}
// {
//   "isSuccess": true,
//   "data": {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0ZDRhZDExMS1jNDNiLTRhY2QtYjFjNC04MmI2MzZiM2JiNjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjQ0MjlhZGZjLWJiOGUtNGZmNi04MjY0LWUzMGJjMGEyNTk0MyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJkZXh5bHVmeUBsb2dzbWFydGVyLm5ldCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkNvYWNoIiwiZXhwIjoxNzQyNDE4MTQwLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTI4IiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NDAwNC8ifQ.XD1EedxtERFM64jgZHwdnJUA5mZWt-3u3XxS48UXYts",
//       "refreshToken": "9FKuyO7ueIk3WhdjMzlFu8G5v8+87NnzjDGm/DJ20O0=",
//       "exipiration": "2025-03-19T22:32:21.1212356+01:00"
//   }
// }

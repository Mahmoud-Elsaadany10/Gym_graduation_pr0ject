import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | "light" = 'success';

  private _loading = new BehaviorSubject<boolean>(false);
  public loading$ = this._loading.asObservable();
  private requestCount = 0;
  private stripePromise: Promise<Stripe | null>;


  constructor(private _http : HttpClient) {
    this.stripePromise =  loadStripe('pk_test_51RED2v2cRXTSXYgVo0fOSrsKQkvpJXlyvsm48rgkuUykYCD0YMJqCrGm7bgzHzPkpHZBNgc9yyTsFuEVRLQYde8j00ubFmrg3v');
  }

  getStripe(): Promise<Stripe | null> {
    return this.stripePromise;
  }

  show(message: string, type: 'success' | 'error' | 'warning' | 'light' = 'success') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  appear() {
    this.requestCount++;
    this._loading.next(true);
  }

  hide() {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this._loading.next(false);
      this.requestCount = 0;
    }
  }
  // gym  rating
  sendRating(payload: {
    gymID: number;
    ratingValue: number;
    review: string;
  }): Observable<any> {
    return this._http.post(`${environment.mainurl}/GymRating`, payload);
  }

  UpdateRating(payload: {
    ratingValue: number;
    review: string;
  } , id : number): Observable<any> {
    return this._http.put<any>(`${environment.mainurl}/GymRating/${id}`, payload);
  }
  deleteRating(id : number): Observable<any> {
    return this._http.delete<any>(`${environment.mainurl}/GymRating/${id}`);
  }

  getRatingById(id: number): Observable<any> {
    return this._http.get<any>(`${environment.mainurl}/GymRating/UserRating/${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }

  sendTrainingRating(payload: {
    coachId: string;
    ratingValue: number;
    review: string;
  }): Observable<any> {
    return this._http.post(`${environment.mainurl}/CoachRating`, payload);
  }

  getTrainingRatingById(id: string): Observable<any> {
    return this._http.get<any>(`${environment.mainurl}/CoachRating/GetCoachRatingByCoachId/${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }
  updateTrainingRating(payload: {
    ratingValue: number;
    review: string;
  } , id : string): Observable<any> {
    return this._http.put<any>(`${environment.mainurl}/CoachRating/${id}`, payload);
  }
  deleteTrainingRating(id : string): Observable<any> {
    return this._http.delete<any>(`${environment.mainurl}/CoachRating/${id}`);
  }

  checkIfRateTraine(id: string): Observable<any> {
    return this._http.get<any>(`${environment.mainurl}/CoachRating/hasRated/${id}`,
      { headers: { 'X-Skip-Error': 'true' } });
  }

}

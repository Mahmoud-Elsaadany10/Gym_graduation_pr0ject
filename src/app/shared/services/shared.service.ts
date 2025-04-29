import { Injectable } from '@angular/core';
import { loadStripe, Stripe } from '@stripe/stripe-js';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' | 'warning' | "light" = 'success';
  private stripePromise: Promise<Stripe | null>;


  constructor() {
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

}

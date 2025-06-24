import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class isloggedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const requireLogin = route.data['requireLogin'] as boolean;

    const isLoggedIn = !!token;

    if (requireLogin && !isLoggedIn) {
      return false;
    }
    if (!requireLogin && isLoggedIn) {
      return false;
    }

    return true;
  }
}

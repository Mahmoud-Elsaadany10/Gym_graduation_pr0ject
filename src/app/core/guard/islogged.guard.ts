import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class isloggedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token =  localStorage.getItem('token') || sessionStorage.getItem('token');
      if (token) {
        return false;
      } else {
        return true;
      }
    }
  }


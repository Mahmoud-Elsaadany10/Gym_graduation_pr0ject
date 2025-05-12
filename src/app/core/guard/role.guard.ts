import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class roleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token =  localStorage.getItem('token') || sessionStorage.getItem('token');

    // if (!token) {
    //   this.router.navigate(['layout/home']);
    //   return false;
    // }
      const decodedToken: any = jwtDecode(token!);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (userRole === 'Coach') {
        return true;
      } else {
        this.router.navigate(['/layout/home']);
        return false;
      }
    }


}

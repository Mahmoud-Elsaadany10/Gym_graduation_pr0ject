import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class roleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token =  localStorage.getItem('token') || sessionStorage.getItem('token');
    const requireLogin = route.data['requireLogin'] as boolean;


      const decodedToken: any = jwtDecode(token!);
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (userRole === 'Coach' && requireLogin) {
        return true;
      } else if (userRole == 'Trainee' && !requireLogin) {
        return false;
      }else{
        // this.router.navigate(['/login']);
        return false;
      }
    }


}

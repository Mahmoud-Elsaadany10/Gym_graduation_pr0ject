import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SharedService } from '../../shared/services/shared.service';

@Injectable()
export class HandleErrorInterceptor implements HttpInterceptor {
  constructor(private toastService: SharedService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unexpected error occurred';
        let errorType: 'success' | 'error' | 'warning' | "light" = 'error';

        switch (error.status) {
          case 401:
            errorMessage = 'Unauthorized! Please login.';
            break;
          case 403:
            errorMessage = 'Access Denied! You don’t have permission.';
            break;
          case 500:
            errorMessage = 'Internal Server Error! Please try again later.';
            break;
          case 400:
            errorMessage = 'Please check your input.';
            errorType = 'warning';
            break;
          case 409:
            errorMessage = 'Email already exists! Try logging in.';
            break;
        }

        this.toastService.show(errorMessage, errorType);

        console.error('HTTP Error:', error);
        return throwError(() => error);
      })
    );
  }
}


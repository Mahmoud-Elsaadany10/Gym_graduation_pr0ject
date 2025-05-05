// spinner.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SharedService } from '../../shared/services/shared.service';

@Injectable()
export class SpinnerInterceptor implements HttpInterceptor {
  constructor(private spinnerService: SharedService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerService.appear();
    return next.handle(req).pipe(
      finalize(() => this.spinnerService.hide())
    );
  }
}

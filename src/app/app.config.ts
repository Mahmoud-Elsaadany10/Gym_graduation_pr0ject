import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HandleErrorInterceptor } from './core/intercptor/handel-error.interceptor';
import { authInterceptor } from './core/intercptor/auth.interceptor';
import { SpinnerInterceptor } from './core/intercptor/spinner.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: HandleErrorInterceptor , multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor , multi: true },

    { provide: HTTP_INTERCEPTORS, useClass: authInterceptor , multi: true }, provideAnimationsAsync()]
};

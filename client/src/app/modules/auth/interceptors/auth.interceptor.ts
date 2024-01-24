import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the token from the AuthService
    const authToken = this.authService.getUserData()?.token;

    // Clone the request to add the new header.
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Send the newly created request
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check for token expiration or 401 status
        if (error.error.error === 'Unauthorized - Token expired or invalid.') {
          // Clear user data and handle token expiration
          this.authService.clearUserData(); 
        }

        // Propagate the error
        return throwError(error);
      })
    );
  }
}


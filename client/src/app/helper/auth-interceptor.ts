import {Injectable} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {TokenStorage} from '../service/token-storage';
import {catchError, Observable, throwError} from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenStorage) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest = req;
        const token = this.tokenService.getToken();
        if(token != null){
          authRequest = req.clone({
            setHeaders: {Authorization: `${token}` }
          });
        }
        return next.handle(authRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.tokenService.logOut();
              window.location.reload();
            }
            const errorMsg = error.error?.error || error.error?.message || error.statusText;
            console.error('Interceptor caught error:', errorMsg);
            return throwError(() => new Error(errorMsg));
          })
        );
  }
}
export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];

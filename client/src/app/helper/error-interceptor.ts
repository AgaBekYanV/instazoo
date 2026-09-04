import {Injectable, Service} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TokenStorage} from '../service/token-storage';
import {NotificationService} from '../service/notificationService';
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenStorage,
              private notificationService: NotificationService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(err =>{
          if(err.status === 401){
            this.tokenService.logOut();
            window.location.reload();
          }

          const error = err.error.message || err.statusText;
          this.notificationService.showSnack(error);
          return throwError(()=>error)  ;
        }));
  }
}

export const authErrorInterceptorProvider = [
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
];

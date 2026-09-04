import {Injectable} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {TokenStorage} from '../service/token-storage';
import {Observable} from "rxjs";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

  constructor(private tokenService: TokenStorage) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let authRequest = req;
        const token = this.tokenService.grtToken();
        if(token != null){
          authRequest = req.clone({headers: req.headers.set(TOKEN_HEADER_KEY, token)});
        }
        return next.handle(authRequest);
  }
}
export const authInterceptorProviders = [
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
];

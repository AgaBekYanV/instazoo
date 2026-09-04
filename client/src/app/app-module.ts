import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material-module';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptorProviders } from './helper/auth-interceptor';
import { authErrorInterceptorProvider } from './helper/error-interceptor';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';

@NgModule({
  declarations: [App, Login, Register],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, ReactiveFormsModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    authInterceptorProviders,
    authErrorInterceptorProvider,
  ],
  bootstrap: [App],
})
export class AppModule {}

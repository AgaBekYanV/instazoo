import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MaterialModule } from './material-module';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { authInterceptorProviders } from './helper/auth-interceptor';
import { authErrorInterceptorProvider } from './helper/error-interceptor';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Navigation } from './layout/navigation/navigation';
import { MatTooltip } from '@angular/material/tooltip';
import { Index } from './layout/index/index';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [App, Login, Register, Navigation, Index],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltip,
    MatProgressSpinnerModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withInterceptorsFromDi()),
    authInterceptorProviders,
    authErrorInterceptorProvider
  ],
  bootstrap: [App],
})
export class AppModule {}

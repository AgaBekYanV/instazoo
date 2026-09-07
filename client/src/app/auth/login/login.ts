import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../service/authService';
import {TokenStorage} from '../../service/token-storage';
import {NotificationService} from '../../service/notificationService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  styleUrls: ['./login.css'],
  templateUrl: './login.html',
})
export class Login implements  OnInit{

  public loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorage,
    private notificationService: NotificationService,
    private router: Router,
    private fb: FormBuilder) {
    if(this.tokenStorage.getUser()){
      this.router.navigate(['main']);
    }
  }

    ngOnInit(): void {
      this.loginForm =this.createLoginForm();
    }

    createLoginForm(): FormGroup {
      return this.fb.group({
        username: ['', [Validators.required]],
        password: ['',[Validators.required]]
      })
    }

    submit(): void {
      this.authService.login({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      }).subscribe({
        next: (data) => {
          console.log(data);

          this.tokenStorage.saveToken(data.token);
          this.tokenStorage.saveUser((data));

          this.notificationService.showSnack('Successfully logged in');
          this.router.navigate(['/']);
          window.location.reload();
        },
        error: (error) => {
          console.log(error);
          this.notificationService.showSnack(error.message);
        }
      });
    }
}

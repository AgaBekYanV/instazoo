import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../service/authService';
import {NotificationService} from '../../service/notificationService';

@Component({
  selector: 'app-register',
  standalone: false,
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit{
  hide = true;
  public registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private fb: FormBuilder) {
  }



    ngOnInit(): void {
      this.registerForm =this.createRegisterForm();
    }

  createRegisterForm(): FormGroup {
    return this.fb.group({
      firstname: ['', Validators.required],
      username: ['', [Validators.required, Validators.minLength(3)]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      bio: [''],
      password: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  submit(): void {
    console.log(this.registerForm.value);
    this.authService.register({
      firstname: this.registerForm.value.firstname,
      username: this.registerForm.value.username,
      lastname: this.registerForm.value.lastname,
      email: this.registerForm.value.email,
      bio: this.registerForm.value.bio,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword
    }).subscribe({
      next: (data) => {
        console.log(data);

        this.notificationService.showSnack('Successfully Registered!');
      },
      error: (error) => {
        console.log(error);
        this.notificationService.showSnack(error.message);
      }
    });
  }
}

import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NotificationService} from '../../service/notificationService';
import {MAT_AUTOCOMPLETE_VALUE_ACCESSOR} from '@angular/material/autocomplete';
import {UserService} from '../../service/userService';
import {User} from '../../models/User';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  styleUrl: './edit-user.css',
  templateUrl: './edit-user.html',
})
export class EditUser implements OnInit {

    public profileEditForm!: FormGroup;

    constructor(private dialogRef: MatDialogRef<EditUser>,
                private fb: FormBuilder,
                private notificationService: NotificationService,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private userService: UserService) { }

    ngOnInit(): void {
      this.profileEditForm = this.createProfileForm();
    }

    createProfileForm(): FormGroup {
      return this.fb.group({
        firstName: [this.data.user.firstName, Validators.compose([Validators.required])],
        lastName: [this.data.user.lastName, Validators.compose([Validators.required])],
        bio: [this.data.user.bio, Validators.compose([Validators.required])]
      });
    }

    submit(){
      this.userService.updateUser(this.updateUser())
        .subscribe(() => {
          this.notificationService.showSnack('User updated successfully');
          this.dialogRef.close();
        });
    }

    private updateUser(): User {
      this.data.user.firstName = this.profileEditForm.value.firstName;
      this.data.user.lastName = this.profileEditForm.value.lastName;
      this.data.user.bio = this.profileEditForm.value.bio;
      return this.data.user;
    }

    closeDialog(){
      this.dialogRef.close();
    }
}

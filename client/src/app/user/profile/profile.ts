import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { User } from '../../models/User';
import { TokenStorage } from '../../service/token-storage';
import { PostService } from '../../service/postService';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NotificationService } from '../../service/notificationService';
import { UserService } from '../../service/userService';
import { ImageUpload } from '../../service/image-upload';
import { EditUser } from '../edit-user/edit-user';

@Component({
  selector: 'app-profile',
  standalone: false,
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  user: User | null = null;


  userProfileImage: string | null = null;

  selectedFile: File | null = null;
  previewImageURL: string | null = null;

  constructor(
    private tokenService: TokenStorage,
    private postService: PostService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private userService: UserService,
    private imageService: ImageUpload,
    private cd: ChangeDetectorRef // Ручное управление рендером
  ) {}

  ngOnInit(): void {
    this.loadUser();
    this.loadProfileImage();
  }

  private loadUser() {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки пользователя:', err);
        this.user = null;
        this.cd.detectChanges();
      }
    });
    console.log(this.user);
  }

  private loadProfileImage() {
    this.imageService.getProfileImage().subscribe({
      next: (data) => {
        // Безопасное извлечение с проверкой на null/undefined
        this.userProfileImage = data?.imageBytes || null;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.log('У пользователя нет картинки или ошибка загрузки:', err);
        this.userProfileImage = null;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.previewImageURL = reader.result as string;
        this.cd.detectChanges();
      };
    }
  }

  openEditDialog() {
    if (!this.user) return;

    const dialogUserEditConfig = new MatDialogConfig();
    dialogUserEditConfig.width = '400px';
    dialogUserEditConfig.data = { user: this.user };

    const dialogRef = this.dialog.open(EditUser, dialogUserEditConfig);

    // Опционально: обновить данные после закрытия диалога редактирования
    dialogRef.afterClosed().subscribe(() => {
      this.loadUser();
    });
  }

  formatImage(img: string | null): string | null {
    if (!img) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  onUpload() {
    if (this.selectedFile) {
      this.imageService.uploadImageForUser(this.selectedFile).subscribe({
        next: () => {
          this.notificationService.showSnack('Profile Image updated successfully.');
          this.previewImageURL = null; // Сбрасываем превью
          this.selectedFile = null;
          this.loadProfileImage(); // Перезагружаем картинку с сервера
        },
        error: (err) => {
          console.error('Ошибка загрузки:', err);
          this.notificationService.showSnack('Failed to upload image.');
        }
      });
    }
  }
}

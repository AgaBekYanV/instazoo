import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Post} from '../../models/Post';
import {PostService} from '../../service/postService';
import {ImageUpload} from '../../service/image-upload';
import {NotificationService} from '../../service/notificationService';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-post',
  standalone: false,
  styleUrl: './add-post.css',
  templateUrl: './add-post.html',
})
export class AddPost implements OnInit {

  postForm!: FormGroup;
  selectedFile!: File;
  isPostCreated = false;
  createdPost!: Post;
  previewImgURL: any;

  constructor(private postService: PostService,
              private imageUploadService: ImageUpload,
              private notificationService: NotificationService,
              private router: Router,
              private fb: FormBuilder) {
  }

    ngOnInit(): void {
      this.postForm = this.createPostForm();
    }

  createPostForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.compose([Validators.required])],
      caption: ['', Validators.compose([Validators.required])],
      location: ['', Validators.compose([Validators.required])]
    });
  }

  submit(){
    this.postService.createPost({
      title: this.postForm.value.title,
      caption: this.postForm.value.caption,
      location: this.postForm.value.location
    }).subscribe(data => {
      this.createdPost = data;
      console.log('Post created');
      console.log(data);

      if(this.createdPost.id != null){
        this.imageUploadService.uploadImageToPost(this.selectedFile, this.createdPost.id)
        .subscribe(()=> {
          this.notificationService.showSnack('Post created successfully.');
          this.isPostCreated = true;
          this.router.navigate(['/profile']);
        });
      }
    });
  }

  onFileSelected(event: any){
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = (e : ProgressEvent<FileReader>)=>{
      this.previewImgURL = reader.result;
    };
  }
}

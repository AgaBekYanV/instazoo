import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Post} from '../../models/Post';
import {PostService} from '../../service/postService';
import {ImageUpload} from '../../service/image-upload';
import {CommentService} from '../../service/commentService';
import {NotificationService} from '../../service/notificationService';

@Component({
  selector: 'app-posts',
  standalone: false,
  styleUrl: './posts.css',
  templateUrl: './posts.html',
})
export class Posts implements OnInit {

  isUserPostsLoaded = false;
  posts: Post [] = [];

  constructor(private postService: PostService,
              private imageService: ImageUpload,
              private commentService: CommentService,
              private notificationService: NotificationService,
              private cdr: ChangeDetectorRef ) {  }


    ngOnInit(): void {
      this.postService.getPostForCurrentUser()
        .subscribe(data => {
          console.log(data);
          this.posts = data;
          this.getImagesToPosts(this.posts);
          this.getCommentsToPosts(this.posts);
          this.isUserPostsLoaded = true;
          this.cdr.markForCheck();
        });
    }

  getImagesToPosts(posts: Post[]){
    posts.forEach(p => {
      this.imageService.getImageForPost(p.id!)
        .subscribe(data => {
          p.image = data.imageBytes;
          this.cdr.markForCheck();
        });
    });
  }

  getCommentsToPosts(posts: Post[]){
    posts.forEach(p => {
      this.commentService.getCommentsToPost(p.id!)
        .subscribe(data => {
          p.comments = data;
          this.cdr.markForCheck();
        });
    });
  }

  removePost(post: Post, index: number) {
    console.log(post);
    const result = confirm('Do you really want to remove this post?');
    if(result){
      this.postService.deletePost(post.id!)
        .subscribe(()=>{
          this.posts.splice(index, 1);
          this.notificationService.showSnack('Post deleted');
        });
    }
  }

  formatImage(img: any): any{
    if(img == null){
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }

  deleteComment(commentId: number, postIndex: number, commentIndex: number){
    const post = this.posts[postIndex];

    this.commentService.deleteComment(commentId)
      .subscribe(data => {
        this.notificationService.showSnack('Comment deleted');
        post.comments!.splice(commentIndex, 1);
      })
  }

}

import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { PostService } from '../../service/postService';
import { CommentService } from '../../service/commentService';
import { UserService } from '../../service/userService';
import { NotificationService } from '../../service/notificationService';
import { ImageUpload } from '../../service/image-upload';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-index',
  standalone: false,
  styleUrl: './index.css',
  templateUrl: './index.html',
})
export class Index implements OnInit {
  private cd = inject(ChangeDetectorRef);

  isPostsLoaded = false;
  isUserDataLoaded = false;
  posts: Post[] = [];  // ← инициализируем пустым массивом
  user: User | null = null;  // ← nullable вместо !

  constructor(
    private postService: PostService,
    private userService: UserService,
    private commentService: CommentService,
    private notificationService: NotificationService,
    private imageService: ImageUpload
  ) {}

  ngOnInit(): void {
    // Загружаем посты и юзера параллельно
    this.loadPosts();
    this.loadUser();
  }

  private loadPosts(): void {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        //console.log('Posts loaded:', data);
        this.posts = data ?? [];

        // Загружаем картинки и комментарии для всех постов
        this.loadPostDetails(this.posts);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.isPostsLoaded = true;  // всё равно показываем страницу
      }
    });
  }

  private loadUser(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.user = data;
        this.isUserDataLoaded = true;
        this.cd.detectChanges();  // явный change detection
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });
  }

  private loadPostDetails(posts: Post[]): void {
    if (posts.length === 0) {
      this.isPostsLoaded = true;
      this.cd.detectChanges();
      return;
    }
    //console.log('Внутри loadPostDetails');

    // Загружаем картинки и комментарии параллельно для каждого поста
    const detailRequests = posts.map(post => {
      const imageReq =
        post.id !== undefined ?
          this.imageService.getImageForPost(post.id!)
          : null;
      const commentsReq = post.id !== undefined
        ? this.commentService.getCommentsToPost(post.id)
        : null;

      //console.log('Прошол запросы коментов и картинки');

      return forkJoin({
        image: imageReq ?? [null],
        comments: commentsReq ?? [[]]
      });
    });

    forkJoin(detailRequests).subscribe({
      next: (results) => {
        results.forEach((result, index) => {
          const post = posts[index];
          if (result.image) {
            post.image = result.image.imageBytes;
          }
          if (result.comments) {
            post.comments = result.comments;

          }
        });

        this.isPostsLoaded = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load post details:', err);
        this.isPostsLoaded = true;
        this.cd.detectChanges();
      }
    });
  }

  // Безопасный метод для проверки лайка
  isLiked(post: Post): boolean {
    if (!post.usersLiked || !this.user?.username) {
      return false;
    }
    return post.usersLiked.includes(this.user.username);
  }

  getLikeClass(post: Post): string {
    return this.isLiked(post) ? 'is-liked' : 'not-liked';
  }

  likePost(postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    if (!post) return;

    if (!post.usersLiked) {
      post.usersLiked = [];
    }

    if (!this.isLiked(post)) {
      this.postService.likePost(postId, this.user!.username).subscribe({
        next: () => {
          post.usersLiked!.push(this.user!.username);
          this.notificationService.showSnack('Liked!');
          this.cd.detectChanges();
        }
      });
    } else {
      this.postService.likePost(postId, this.user!.username).subscribe({
        next: () => {
          const index = post.usersLiked!.indexOf(this.user!.username, 0);
          if (index > -1) {
            post.usersLiked!.splice(index, 1);
          }
          this.cd.detectChanges();
        }
      });
    }
  }

  postComment(message: string, postId: number, postIndex: number): void {
    const post = this.posts[postIndex];
    if (!post) return;

    if (!post.comments) {
      post.comments = [];
    }

    this.commentService.addToCommentToPost(postId, message).subscribe({
      next: (data) => {
        post.comments!.push(data);
        this.cd.detectChanges();
      }
    });
  }

  formatImage(img: any): any {
    if (img == null) {
      return null;
    }
    return 'data:image/jpeg;base64,' + img;
  }
}

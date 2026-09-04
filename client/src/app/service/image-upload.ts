import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const IMAGE_API = 'http://localhost:8080/api/image/';

@Injectable({
  providedIn: 'root'
})
export class ImageUpload {
  constructor(private http: HttpClient) {  }

  uploadImageForUser(file: File): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file);

    return this.http.post(IMAGE_API + 'upload', uploadData);
  }

  uploadImageToPost(file: File, postId: number): Observable<any> {
    const uploadData = new FormData();
    uploadData.append('file', file);

    return this.http.post(IMAGE_API + postId + '/upload', uploadData);
  }

  getProfileImage(): Observable<any> {
    return this.http.get(IMAGE_API + 'profileImage');
  }

  getImageForPost(postId: number): Observable<any> {
    return this.http.get(IMAGE_API + postId + '/image');
  }
}

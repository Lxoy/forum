import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../model/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {

  private apiUrl = 'http://localhost:3000/api/home';

  private posts$ = new BehaviorSubject<Post[]>([]);

  constructor(private http: HttpClient) {}

  getPosts() {
    return this.posts$.asObservable();
  }

  fetchByThread(threadId: number): void {
    this.http
      .get<any[]>(`${this.apiUrl}/thread/${threadId}/posts`)
      .pipe(
        map(data =>
          data.map(p => ({
            id: p.id,
            content: p.content,
            userId: p.user_id,
            username: p.username,
            createdAt: new Date(p.created_at)
          }))
        )
      )
      .subscribe({
        next: posts => this.posts$.next(posts),
        error: err => console.error(err)
      });
  }

  createPost(postData: { threadId: number; content: string }) {
    return this.http.post(`${this.apiUrl}/post`, postData);
  }

}

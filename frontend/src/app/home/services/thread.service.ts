import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Thread } from '../model/thread.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = 'http://localhost:3000/api/home';

  private threads$ = new BehaviorSubject<Thread[]>([]);
  private selectedCategory$ = new BehaviorSubject<string | null>(null);
  private threadSubject = new BehaviorSubject<Thread | null>(null);

  constructor(private http: HttpClient) { }

  getThread(): Observable<Thread | null> {
    return this.threadSubject.asObservable();
  }

  getThreads(): Observable<Thread[]> {
  return this.threads$.asObservable();
}

  fetchExplore(): void {
    this.http
      .get<any[]>(`${this.apiUrl}/threads`)
      .pipe(
        map(data =>
          data.map(t => ({
            id: t.id,
            title: t.title,
            userId: t.user_id,
            username: t.username,
            categoryId: t.category_id,
            category: t.category,
            createdAt: new Date(t.created_at),
            postsCount: t.posts_count
          }))
        )
      )
      .subscribe({
        next: threads => this.threads$.next(threads),
        error: err => console.error(err)
      });
  }

  fetchPopular() {
    this.http
      .get<any[]>(`${this.apiUrl}/threads/popular`)
      .pipe(
        map(data =>
          data.map(t => ({
            id: t.id,
            title: t.title,
            userId: t.user_id,
            username: t.username,
            categoryId: t.category_id,
            category: t.category,
            createdAt: new Date(t.created_at),
            postsCount: t.posts_count
          }))
        )
      )
      .subscribe({
        next: threads => this.threads$.next(threads),
        error: err => console.error(err)
      });
  }

  fetchByCategory(categoryId: number) {
    this.http
      .get<any[]>(`${this.apiUrl}/categories/${categoryId}/threads`)
      .pipe(
        map(data =>
          data.map(t => ({
            id: t.id,
            title: t.title,
            userId: t.user_id,
            username: t.username,
            categoryId: t.category_id,
            category: t.category,
            createdAt: new Date(t.created_at),
            postsCount: t.posts_count
          }))
        )
      )
      .subscribe({
        next: threads => this.threads$.next(threads),
        error: err => console.error(err)
      });
  }

  fetchThread(threadId: number) {
    this.threadSubject.next(null);
    this.http.get<any>(`${this.apiUrl}/threads/${threadId}`)
      .pipe(
        map(t => ({
          id: t.id,
          title: t.title,
          userId: t.user_id,
          username: t.username,
          categoryId: t.category_id,
          category: t.category,
          createdAt: new Date(t.created_at),
          postsCount: Number(t.posts_count)
        }))
      )
      .subscribe(thread => this.threadSubject.next(thread));
  }

  deleteThread(threadId: number) {
    return this.http.delete(`${this.apiUrl}/threads/${threadId}`);
  }

  updateTitle(threadId: number, title: string) {
    return this.http.put(
      `${this.apiUrl}/threads/${threadId}`,
      { title }
    );
  }

  createThread(title: string, categoryId: number) {
    return this.http.post<any>(`${this.apiUrl}/threads`, { title, categoryId });
  }
}

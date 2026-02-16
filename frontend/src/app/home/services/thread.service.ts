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

  getThreads() {
    return this.threads$.asObservable();
  }

  setCategory(category: string | null) {
    this.selectedCategory$.next(category);
  }

  getCategory() {
    return this.selectedCategory$.asObservable();
  }

  fetchExplore(): void {
    this.http
      .get<any[]>(`${this.apiUrl}/thread`)
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
      .get<any[]>(`${this.apiUrl}/popular`)
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

  fetchByCategory(category: number) {
    this.http
      .get<any[]>(`${this.apiUrl}/category/${category}`)
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
    this.http.get<any>(`${this.apiUrl}/thread/${threadId}`)
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



  getThread(): Observable<Thread | null> {
    return this.threadSubject.asObservable();
  }

  deleteThread(threadId: number) {
    return this.http.delete(`${this.apiUrl}/thread/${threadId}`);
  }

  updateTitle(threadId: number, title: string) {
    return this.http.put(
      `${this.apiUrl}/thread/${threadId}`,
      { title }
    );
  }

  createThread(title: string, categoryId: number) {
    return this.http.post<any>(`${this.apiUrl}/thread`, { title, categoryId })
      .pipe(
        map(t => ({
          id: t.threadId,
          title: t.title,
          userId: t.user_id,
          username: t.username,
          categoryId: t.category_id,
          category: t.category,
          createdAt: new Date(t.created_at),
          postsCount: 0
        }))
      );
  }


}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Thread } from '../model/thread.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ThreadService {
  private apiUrl = 'http://localhost:3000/api/home';

  private threads$ = new BehaviorSubject<Thread[]>([]);
  private selectedCategory$ = new BehaviorSubject<string | null>(null);

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

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface Thread {
  id: number;
  title: string;
  userId: number;
  username: string;
  categoryId: number;
  category: string;
  createdAt: Date;
  postsCount: number;
}

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  newThreadForm: FormGroup;
  isNewThread: boolean = false
  categories: Category[] = [];
  threads: Thread[] = [];


  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.newThreadForm = this.fb.group({
      thread: ['', Validators.required],
      post: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.http
      .get<Category[]>('http://localhost:3000/api/home/categories')
      .subscribe({
        next: (data) => (this.categories = data),
        error: (err) => console.error(err),
      });

    this.loadThreads();

  }

  loadThreads(): void {
    this.http
      .get<any[]>('http://localhost:3000/api/home/thread')
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
        next: (threads: Thread[]) => (this.threads = threads),
        error: (err) => console.error(err)
      });
  }

  showNewThreadMenu(): void {
    this.isNewThread = !this.isNewThread;
  }

  signOut(): void {
    this.authService.logout();
  }

  newThread(): void {
  if (this.newThreadForm.invalid) return;

  const token = this.authService.getToken();

  const threadPayload = {
    title: this.newThreadForm.value.thread,
    categoryId: 1 // ⬅️ zasad hardcode
  };

  this.http.post<{ threadId: number }>(
    'http://localhost:3000/api/home/thread',
    threadPayload,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  ).subscribe({
    next: (res) => {
      const postPayload = {
        content: this.newThreadForm.value.post,
        threadId: res.threadId
      };

      this.http.post(
        'http://localhost:3000/api/home/post',
        postPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ).subscribe({
        next: () => {
          this.isNewThread = false;
          this.newThreadForm.reset();
          this.loadThreads();
        },
        error: err => console.error('Post error', err)
      });
    },
    error: err => console.error('Thread error', err)
  });
}
}

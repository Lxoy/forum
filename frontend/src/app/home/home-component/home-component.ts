import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category.model';
import { ThreadService } from '../services/thread.service';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  newThreadForm: FormGroup;
  isNewThread = false;
  categories: Category[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private threadService: ThreadService,
    private postService: PostService
  ) {
    this.newThreadForm = this.fb.group({
      thread: ['', Validators.required],
      category: ['', Validators.required],
      post: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories() {
    this.http.get<Category[]>('http://localhost:3000/api/home/categories')
      .subscribe(c => this.categories = c);
  }

  showNewThreadMenu() {
    this.isNewThread = true;
  }

  closeNewThread() {
    this.isNewThread = false;
    this.newThreadForm.reset();
    this.newThreadForm.markAsPristine();
    this.newThreadForm.markAsUntouched();
    Object.keys(this.newThreadForm.controls).forEach(key => {
      this.newThreadForm.get(key)?.setErrors(null);
    });
  }

  createThread() {
    if (this.newThreadForm.invalid) return;

    const { thread, category, post } = this.newThreadForm.value;

    this.http.post<{ threadId: number }>('http://localhost:3000/api/home/thread', {
      title: thread,
      categoryId: category
    }).subscribe({
      next: newThread => {
        const threadId = newThread.threadId;
        if (!threadId) return console.error('Backend nije vratio threadId!');

        // 2️⃣ Kreiraj prvi post
        this.http.post('http://localhost:3000/api/home/post', {
          content: post,
          threadId: threadId
        }).subscribe({
          next: () => {
            
            this.closeNewThread();

            this.openThread(threadId);
          },
          error: err => console.error('Greška kod kreiranja posta:', err)
        });
      },
      error: err => console.error('Greška kod kreiranja threada:', err)
    });
  }

  openThread(id: number) {
    this.router.navigate(['/thread', id]);
  }

  signOut() {
    this.authService.logout();
  }

}

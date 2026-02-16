import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../model/category.model';
import { ThreadService } from '../services/thread.service';
import { PostService } from '../services/post.service';
import { Router } from '@angular/router';
import { CategoryService } from '../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../model/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent implements OnInit {
  user: User | null = null;

  newThreadForm: FormGroup;
  isNewThread = false;
  isCreating = false;

  categories: Category[] = [];
  isCreateCategory = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private threadService: ThreadService,
    private postService: PostService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private userService: UserService
  ) {
    this.newThreadForm = this.fb.group({
      thread: ['', Validators.required],
      category: ['', Validators.required],
      post: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userService.getUser().subscribe(u => {
      this.user = u;
    });

    this.loadCategories();
  }

  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (c: Category[]) => this.categories = [...c],
      error: err => {
        console.error(err);
        this.snackBar.open('Error loading categories', 'Close', { duration: 4000 });
      }
    });
  }

  showNewThreadMenu() {
    this.isNewThread = true;
  }

  closeNewThread() {
    this.isNewThread = false;
    this.newThreadForm.reset();
    this.isCreating = false;
  }

  createThread() {
    if (this.newThreadForm.invalid || this.isCreating) return;

    this.isCreating = true;

    const { thread, category, post } = this.newThreadForm.value;

    this.threadService.createThread(thread, category)
      .subscribe({
        next: (newThread) => {

          const threadId = newThread.id;

          this.postService.createPost(threadId, post)
            .subscribe({
              next: () => {
                this.isCreating = false;
                this.closeNewThread();
                this.snackBar.open('Thread created successfully', 'Close', { duration: 3000 });
                this.openThread(threadId);
              },
              error: (err) => {
                console.error(err);
                this.isCreating = false;
                this.snackBar.open('Error creating post', 'Close', { duration: 5000 });
              }
            });

        },
        error: (err) => {
          console.error(err);
          this.isCreating = false;
          this.snackBar.open('Error creating thread', 'Close', { duration: 5000 });
        }
      });
  }

  openThread(id: number) {
    this.router.navigate(['/thread', id]);
  }

  signOut() {
    this.authService.logout();
  }

  openCreateCategory() {
    this.isCreateCategory = true;
  }

  closeCreateCategory() {
    this.isCreateCategory = false;
  }

  handleCategoryCreated() {
    this.loadCategories();
    this.closeCreateCategory();
    this.snackBar.open('Category created', 'Close', { duration: 3000 });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.snackBar.open('Category deleted successfully', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error: (error) => {
        console.error(error);

        const message =
          error?.error?.message ||
          error?.message ||
          'Something went wrong';

        this.snackBar.open(message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }


}

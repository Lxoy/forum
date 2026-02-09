import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category.model';
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
    private fb: FormBuilder,
    private http: HttpClient
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
    this.isNewThread = !this.isNewThread;
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

  signOut() {
    this.authService.logout();
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { ThreadService } from '../services/thread.service';
import { Category } from '../model/category.model';
import { Thread } from '../model/thread.model';
import { ActivatedRoute } from '@angular/router';

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
    private http: HttpClient,
    private threadService: ThreadService,
    private route: ActivatedRoute,
  ) {
    this.newThreadForm = this.fb.group({
      thread: ['', Validators.required],
      category: ['', Validators.required],
      post: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.handleRoute();
  }

  private loadCategories() {
    this.http.get<Category[]>('http://localhost:3000/api/home/categories')
      .subscribe(c => this.categories = c);
  }

  private handleRoute() {
    this.route.url.subscribe(() => {
      const path = this.route.firstChild?.snapshot.routeConfig?.path;

      if (path === 'popular') {
        this.threadService.fetchPopular();
      } else {
        this.threadService.fetchExplore();
      }
    });
  }

  showNewThreadMenu() {
    this.isNewThread = !this.isNewThread;
  }

  signOut() {
    this.authService.logout();
  }

}

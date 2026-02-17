import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../model/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = 'http://localhost:3000/api/home/categories';

  constructor(private http: HttpClient) { }

  createCategory(data: { name: string; description: string }) {
    return this.http.post(this.apiUrl, data);
  }

  getCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.apiUrl);
}

  deleteCategory(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../model/category.model';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() categories: Category[] = [];
  @Input() userRole?: string | null = null;

  @Output() clearCategory = new EventEmitter<void>();
  @Output() newThread = new EventEmitter<void>();
  @Output() addCategory = new EventEmitter<void>();
  @Output() deleteCategoryEvent = new EventEmitter<number>();

  topicsOpen = true;

  toggleTopics() {
    this.topicsOpen = !this.topicsOpen;
  }


  deleteCategory(id: number): void {
    if (!confirm('Delete this category?')) return;

    this.deleteCategoryEvent.emit(id);
  }
}

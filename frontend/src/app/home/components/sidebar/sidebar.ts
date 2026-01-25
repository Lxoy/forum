import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../home-component/home-component';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() categories: Category[] = [];
  @Input() selectedCategory: string | null = null;

  @Output() selectCategory = new EventEmitter<string>();
  @Output() clearCategory = new EventEmitter<void>();
  @Output() newThread = new EventEmitter<void>();
}

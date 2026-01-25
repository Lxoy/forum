import { Component, Input } from '@angular/core';
import { Thread } from '../../model/thread.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thread-list',
  standalone: false,
  templateUrl: './thread-list.html',
  styleUrl: './thread-list.css',
})
export class ThreadList {
  @Input() threads: Thread[] = [];
  @Input() selectedCategory: string | null = null;
  @Input() currentPage = 1;
  @Input() pageSize = 10;

  constructor(private router: Router) { }

  openThread(id: number) {
    this.router.navigate(['/thread', id]);
  }

  get filteredThreads(): Thread[] {
    if (!this.selectedCategory) {
      return this.threads;
    }

    return this.threads.filter(
      t => t.category === this.selectedCategory
    );
  }

  get paginatedThreads(): Thread[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredThreads.slice(start, start + this.pageSize);
  }
}

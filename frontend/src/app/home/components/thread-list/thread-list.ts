import { Component, Input } from '@angular/core';
import { Thread } from '../../home-component/home-component';

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

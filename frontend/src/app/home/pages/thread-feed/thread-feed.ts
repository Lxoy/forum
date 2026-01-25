import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../model/thread.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-thread-feed',
  standalone: false,
  templateUrl: './thread-feed.html',
  styleUrl: './thread-feed.css',
})
export class ThreadFeed implements OnInit{
  threads: Thread[] = [];

  pageSize = 5;
  currentPage = 1;

  constructor(
    private route: ActivatedRoute,
    private threadService: ThreadService
  ) {}

  ngOnInit() {
     this.threadService.getThreads().subscribe(threads => {
      this.threads = threads;
      this.currentPage = 1;
    });
    
    this.route.url.subscribe(() => {
      this.currentPage = 1;

      const path = this.route.snapshot.routeConfig?.path;
      const category = this.route.snapshot.paramMap.get('name');

      if (path === 'popular') {
        this.threadService.fetchPopular();
      }
      else if (path === 'category/:name' && category) {
        this.threadService.fetchExplore();
      }
      else {
        this.threadService.fetchExplore();
      }
    });
  }

  get paginatedThreads(): Thread[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.threads.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}

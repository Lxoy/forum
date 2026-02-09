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

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      this.currentPage = 1;

      const path = this.route.snapshot.routeConfig?.path;
      const id = params.get('id');

      if (path === 'popular') {
        this.threadService.fetchPopular();
      }
      else if (id) {
        this.threadService.fetchByCategory(Number(id));
      }
      else {
        this.threadService.fetchExplore();
      }
    });

    this.threadService.getThreads().subscribe(threads => {
      this.threads = threads;
    });
  }

  get visibleThreads(): Thread[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.threads.slice(start, start + this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

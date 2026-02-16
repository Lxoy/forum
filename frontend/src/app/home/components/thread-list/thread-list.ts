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

  constructor(private router: Router) { }

  openThread(id: number) {
    this.router.navigate(['/thread', id]);
  }
}

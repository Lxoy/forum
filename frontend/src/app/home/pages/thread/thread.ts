import { Component } from '@angular/core';

@Component({
  selector: 'app-thread',
  standalone: false,
  templateUrl: './thread.html',
  styleUrl: './thread.css',
})
export class Thread {
posts = [
  { author: 'John Doe', content: 'This is the first post.' },
  { author: 'Jane Smith', content: 'Second reply in this thread.' }
];
}

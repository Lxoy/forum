import { Component, ElementRef, ViewChild } from '@angular/core';
import { Post } from '../../model/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Subscription } from 'rxjs';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../model/thread.model';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-thread',
  standalone: false,
  templateUrl: './thread.html',
  styleUrl: './thread.css',
})
export default class ThreadPage {
  currentUserId: number | null = null;

  @ViewChild('postsContainer') postsContainer?: ElementRef;

  currThread: Thread | null = null;
  posts: Post[] = [];
  threadId!: number;

  private postsSub!: Subscription;
  private threadSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private threadService: ThreadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();

    this.threadId = Number(this.route.snapshot.paramMap.get('id'));

    this.threadService.fetchThread(this.threadId);
    this.postService.fetchByThread(this.threadId);

    this.threadSub = this.threadService.getThread()
      .subscribe(thread => this.currThread = thread ?? null);

    this.postsSub = this.postService.getPosts()
      .subscribe(posts => this.posts = posts);
  }

  ngOnDestroy(): void {
    this.postsSub?.unsubscribe();
    this.threadSub?.unsubscribe();
  }

  get isOwner(): boolean {
  const result = this.currThread?.userId === this.currentUserId;
  console.log('isOwner', result, this.currThread?.userId, this.currentUserId);
  return !!result;
}

  deleteThread(): void {
    if (!this.currThread) return;

    if (!confirm('Are you sure you want to delete this thread?')) return;

    this.threadService.deleteThread(this.currThread.id)
      .subscribe(() => this.router.navigate(['/']));
  }

}

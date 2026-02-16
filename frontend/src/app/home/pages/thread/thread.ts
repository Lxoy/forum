import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Post } from '../../model/post.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ThreadService } from '../../services/thread.service';
import { Thread } from '../../model/thread.model';
import { AuthService } from '../../../auth/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-thread',
  standalone: false,
  templateUrl: './thread.html',
  styleUrl: './thread.css',
})
export default class ThreadPage implements OnInit, OnDestroy, AfterViewChecked {
  // =========================
  // Auth
  // =========================
  currentUserId: number | null = null;
  currentUserRole: string | null = null;

  // =========================
  // Thread state
  // =========================
  currThread: Thread | null = null;
  threadId!: number;

  isEditing = false;
  editedTitle = '';

  // =========================
  // Posts state
  // =========================
  posts: Post[] = [];

  editingPostId: number | null = null;
  editedPostContent = '';
  newPostContent = '';

  shouldScroll = false;

  @ViewChild('postsContainer') postsContainer?: ElementRef;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private threadService: ThreadService,
    private authService: AuthService,
    private userService: UserService
  ) { }

  // =========================
  // Lifecycle
  // =========================
  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.threadId = Number(this.route.snapshot.paramMap.get('id'));

    this.userService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUserRole = user?.role || null;
      });

    this.threadService.fetchThread(this.threadId);
    this.postService.fetchByThread(this.threadId);

    this.threadService
      .getThread()
      .pipe(takeUntil(this.destroy$))
      .subscribe(thread => {
        this.currThread = thread;
      });

    this.postService
      .getPosts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(posts => {
        this.posts = posts;
      });
  }


  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.postsContainer) {
      this.postsContainer.nativeElement.scrollTo({
        top: this.postsContainer.nativeElement.scrollHeight,
        behavior: 'smooth'
      });

      this.shouldScroll = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =========================
  // Computed
  // =========================
  get isOwner(): boolean {
    return (
      this.currThread !== null &&
      this.currThread.userId === this.currentUserId
    );
  }

  get isPostInvalid(): boolean {
    return !this.newPostContent.trim();
  }

  // =========================
  // Thread actions
  // =========================
  deleteThread(): void {
    if (!this.currThread) return;
    if (!confirm('Are you sure you want to delete this thread?')) return;

    this.threadService
      .deleteThread(this.currThread.id)
      .subscribe(() => this.router.navigate(['/']));
  }

  startEdit(): void {
    if (!this.currThread) return;

    this.isEditing = true;
    this.editedTitle = this.currThread.title;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editedTitle = '';
  }

  saveTitle(): void {
    if (!this.currThread) return;
    if (!this.editedTitle.trim()) return;

    this.threadService
      .updateTitle(this.currThread.id, this.editedTitle)
      .subscribe(() => {
        this.isEditing = false;
        this.threadService.fetchThread(this.currThread!.id);
      });
  }

  // =========================
  // Post actions
  // =========================
  canDeletePost(postUserId: number): boolean {
    return (
      postUserId === this.currentUserId ||
      this.currentUserRole === 'ADMIN'
    );
  }

  canDeleteThread(): boolean {
  return (
    this.currThread !== null &&
    (
      this.currThread.userId === this.currentUserId ||
      this.currentUserRole === 'ADMIN'
    )
  );
}

  startPostEdit(post: Post): void {
    this.editingPostId = post.id;
    this.editedPostContent = post.content;
  }

  cancelPostEdit(): void {
    this.editingPostId = null;
    this.editedPostContent = '';
  }

  savePost(postId: number): void {
    if (!this.editedPostContent.trim()) return;

    this.postService
      .updatePost(postId, this.editedPostContent)
      .subscribe(() => {
        this.editingPostId = null;
        this.postService.fetchByThread(this.threadId);
      });
  }

  deletePost(postId: number): void {
    if (!confirm('Delete this post?')) return;

    this.postService
      .deletePost(postId)
      .subscribe(() => {
        this.postService.fetchByThread(this.threadId);
      });
  }

  createPost(): void {
    if (!this.currThread) return;
    if (!this.newPostContent.trim()) return;

    this.postService
      .createPost(this.currThread.id, this.newPostContent)
      .subscribe(() => {
        this.newPostContent = '';
        this.shouldScroll = true;
        this.postService.fetchByThread(this.threadId);
      });
  }
}

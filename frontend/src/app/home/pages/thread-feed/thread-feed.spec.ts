import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadFeed } from './thread-feed';

describe('ThreadFeed', () => {
  let component: ThreadFeed;
  let fixture: ComponentFixture<ThreadFeed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreadFeed]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

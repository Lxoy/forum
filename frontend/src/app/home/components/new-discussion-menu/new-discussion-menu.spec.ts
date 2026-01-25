import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDiscussionMenu } from './new-discussion-menu';

describe('NewDiscussionMenu', () => {
  let component: NewDiscussionMenu;
  let fixture: ComponentFixture<NewDiscussionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewDiscussionMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDiscussionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

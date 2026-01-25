import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadList } from './thread-list';

describe('ThreadList', () => {
  let component: ThreadList;
  let fixture: ComponentFixture<ThreadList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ThreadList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

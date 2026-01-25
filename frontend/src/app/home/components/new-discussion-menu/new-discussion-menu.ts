import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../home-component/home-component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-discussion-menu',
  standalone: false,
  templateUrl: './new-discussion-menu.html',
  styleUrl: './new-discussion-menu.css',
})
export class NewDiscussionMenu {
  @Input() form!: FormGroup
  @Input() categories: Category[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
}

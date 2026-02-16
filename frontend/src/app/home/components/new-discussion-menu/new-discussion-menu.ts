import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Category } from '../../model/category.model';

@Component({
  selector: 'app-new-discussion-menu',
  standalone: false,
  templateUrl: './new-discussion-menu.html',
  styleUrl: './new-discussion-menu.css',
})
export class NewDiscussionMenu {
  @Input() form!: FormGroup;
  @Input() categories: Category[] = [];
  @Input() isCreating = false;

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();

  onSubmit() {
    if (this.form.invalid || this.isCreating) return;
    this.submit.emit();
  }
}

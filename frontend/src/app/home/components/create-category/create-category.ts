import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-create-category',
  standalone: false,
  templateUrl: './create-category.html',
  styleUrl: './create-category.css',
})
export class CreateCategory {
   @Output() close = new EventEmitter<void>();
  @Output() created = new EventEmitter<void>();

  categoryForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  submit() {
    if (this.categoryForm.invalid) return;
    console.log('submit called');

    this.loading = true;

    this.categoryService.createCategory(this.categoryForm.value)
      .subscribe({
        next: () => {
          this.loading = false;
          this.created.emit();
        },
        error: (err) => {
          console.error('Error creating category:', err);
          this.loading = false;
        }
      });
  }
}

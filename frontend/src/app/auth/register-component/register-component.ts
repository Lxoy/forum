import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service'

@Component({
  selector: 'app-register-component',
  standalone: false,
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
    this.authService.register(this.registerForm.value)
      .subscribe({
        next: (response: any) => {
          alert(response.message);
          this.registerForm.reset();
          this.registerForm.markAsPristine();
          this.registerForm.markAsUntouched();

           Object.keys(this.registerForm.controls).forEach(key => {
            this.registerForm.get(key)?.setErrors(null);
          });
          
          this.hidePassword = true;
          
        },
        error: err => {
          alert(err.error.message);
        }
      });
  }
  }
}

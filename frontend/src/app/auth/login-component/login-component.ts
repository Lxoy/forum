import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../home/services/user.service';

@Component({
  selector: 'app-login-component',
  standalone: false,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userService: UserService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            alert(response.message);
            this.loginForm.reset();
            this.loginForm.markAsPristine();
            this.loginForm.markAsUntouched();

            Object.keys(this.loginForm.controls).forEach(key => {
              this.loginForm.get(key)?.setErrors(null);
            });

            this.hidePassword = true;

            this.authService.saveToken(response.token);
            this.userService.reloadUser();
            this.router.navigate(['/']);
          },
          error: err => {
            alert(err.error.message);
          }
        })
    }
  }
}

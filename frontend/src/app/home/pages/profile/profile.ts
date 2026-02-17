import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../model/user.model';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user: User | null = null;
  editMode = false;
  profileForm!: FormGroup;

  errorMessage = '';
  successMessage = '';
  isSaving = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.userService.getUser().subscribe(u => {
      this.user = u;
      if (u) {
        this.profileForm.patchValue({
          username: u.username,
          email: u.email
        });
      }
    });

    this.profileForm.valueChanges.subscribe(() => {
      this.errorMessage = '';
      this.successMessage = '';
    });
  }

  enableEdit() {
    this.editMode = true;
    this.successMessage = '';
  }

  cancelEdit() {
    this.editMode = false;
    this.errorMessage = '';

    if (this.user) {
      this.profileForm.patchValue({
        username: this.user.username,
        email: this.user.email
      });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid || this.isSaving) return;

    this.isSaving = true;

    const { username, email } = this.profileForm.value;

    this.userService.updateProfile(username, email)
      .subscribe({
        next: () => {

          this.editMode = false;
          this.successMessage = 'Profile updated successfully.';
          this.isSaving = false;
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMessage = 'Username or email already exists.';
          } else {
            this.errorMessage = 'Something went wrong.';
          }
          this.isSaving = false;
        }
      });
  }

  signOut() {
    this.authService.logout();
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  username = 'YapUser';
  email = 'user@yapyap.com';

  stats = {
    posts: 24,
    threads: 8,
    joined: 'Jan 2025'
  };

  constructor(
    private authService: AuthService
  ) { }

  signOut() {
    this.authService.logout();
  }
}

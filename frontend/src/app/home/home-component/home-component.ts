import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-component',
  standalone: false,
  templateUrl: './home-component.html',
  styleUrl: './home-component.css',
})
export class HomeComponent {
  isNewDiscussion: boolean = true
  items = {
  home: 'Home',
  forum: 'Forum',
  backend: 'Backend'
};


   constructor(
    private authService: AuthService,
  ) {}

  signOut(): void {
    this.authService.logout();
  }
}

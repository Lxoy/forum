import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../model/user.model';
import { AuthService } from '../../auth/auth.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private API_URL = 'http://localhost:3000/api/home/users/me';
  private currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadUser();
  }

  private loadUser() {
    const token = this.authService.getToken();
    if (!token) {
      this.currentUser$.next(null);
      return;
    }

    this.http.get<User>(this.API_URL)
      .subscribe({
        next: user => this.currentUser$.next(user),
        error: () => this.currentUser$.next(null),
      });
  }

  reloadUser(): void {
    this.loadUser();
  }

  getUser(): Observable<User | null> {
    return this.currentUser$.asObservable();
  }

  getRole(): string | null {
    return this.currentUser$.value?.role || null;
  }

  updateProfile(username: string, email: string) {
  return this.http.put<User>(this.API_URL, { username, email })
    .pipe(
      tap(updatedUser => {
        this.currentUser$.next(updatedUser);
      })
    );
}

  logout() {
    this.authService.logout();
    this.currentUser$.next(null);
  }

}

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  user: User | null = null;

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  async google() {
    await this.authService.loginWithGoogle();
  }

  async irUsuario() {

    const user = await this.authService.getCurrentUserData();

    if (!user) return;

    if (user['role'] === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/user']);
    }
  }

  async logout() {
    await this.authService.logout();
  }
}
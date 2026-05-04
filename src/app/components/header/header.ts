import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Auth, onAuthStateChanged, User } from '@angular/fire/auth';
import { AuthService } from '../../services/auth.service';

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
    private authService: AuthService
  ) {}

  ngOnInit() {
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });
  }

  async google() {
    await this.authService.loginWithGoogle();
  }

  async logout() {
    await this.authService.logout();
  }
}
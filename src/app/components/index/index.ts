import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.html',
  styleUrl: './index.css'
})
export class Index implements OnInit {

  message: string = '';
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private auth: Auth,
    private router: Router
  ) {}

  ngOnInit() {

    // 🔥 AHORA SÍ REACTIVO
    onAuthStateChanged(this.auth, (user) => {
      this.user = user;
    });

    this.route.queryParams.subscribe(params => {
      if (params['msg'] === 'login-required') {
        this.message = 'Debes iniciar sesión para reservar un turno';
      }
    });
  }

  async google() {
    await this.authService.loginWithGoogle();
  }

  goToAppointments() {
    this.router.navigate(['/appointments']);
  }
}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AppointmentService } from './services/appointment.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  constructor(
    private auth: AuthService,
    private appt: AppointmentService
  ) {}

  async email() {
    try {
      const res = await this.auth.register('test@test.com', '123456');
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }

  async google() {
    try {
      const res = await this.auth.loginWithGoogle();
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  }

  async logout() {
    try {
      await this.auth.logout();
    } catch (e) {
      console.error(e);
    }
  }

  async crearTurno() {
    try {
      await this.appt.createAppointment({
        date: '2026-05-10',
        time: '14:30',
        reason: 'Consulta genera'
      });
    } catch (e) {
      console.error(e);
    }
  }
}
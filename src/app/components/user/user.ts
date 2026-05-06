import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  standalone: true,
  templateUrl: './user.html',
  styleUrl: './user.css'
})
export class User implements OnInit {

  appointments: any[] = [];

  userName: string = '';
  userEmail: string = '';

  constructor(
    private appt: AppointmentService,
    private authService: AuthService
  ) {}

  async ngOnInit() {

    const userData = await this.authService.getCurrentUserData();

    if (userData) {
      this.userName = userData['name'];
      this.userEmail = userData['email'];
    }

    this.appointments = await this.appt.getUserAppointments();
  }

  // 🔥 determina si ya pasó el turno
  isPast(a: any): boolean {
    return a.timestamp < Date.now();
  }

  // 🔥 botón cancelar
  async cancelar(a: any) {

    if (this.isPast(a)) return;

    const confirmacion = confirm('¿Seguro que quieres cancelar este turno?');

    if (!confirmacion) return;

    try {
      await this.appt.cancelAppointment(a);
      
      // 🔥 actualizar UI sin recargar
      this.appointments = this.appointments.filter(x => x !== a);

      alert('Turno cancelado');
    } catch (e) {
      console.error(e);
      alert('Error al cancelar');
    }
  }
}
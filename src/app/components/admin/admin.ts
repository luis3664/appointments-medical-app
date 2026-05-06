import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  appointments: any[] = [];

  constructor(
    private appt: AppointmentService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {

    const user = await this.authService.getCurrentUserData();

    if (!user || user['role'] !== 'admin') {
      this.router.navigate(['/index']);
      return;
    }

    this.appointments = await this.appt.getAllAppointments();
  }

  isPast(a: any) {
    return a.timestamp < Date.now();
  }

  async cancelar(a: any) {
    if (this.isPast(a)) return;

    await this.appt.cancelAppointment(a);

    this.appointments = this.appointments.filter(x => x.id !== a.id);
  }
}
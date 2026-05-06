import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointment-create.html',
  styleUrl: './appointment-create.css'
})
export class Appointment {
  availableSlots: any[] = [];
  horarios: string[] = [];

  coverage: string = 'Particular';
  date: string = '';
  time: string = '';
  reason: string = '';

  patientName: string = '';
  dni: string = '';
  phone: string = '';
  affiliateNumber: string = '';

  constructor(private appt: AppointmentService, private router: Router) {}

  selectTime(h: string) {
    this.time = h;
  }

  async crearTurno() {

    if (
      !this.patientName ||
      !this.dni ||
      !this.phone ||
      !this.coverage ||
      !this.date ||
      !this.time
    ) {
      alert('Completa todos los campos');
      return;
    }

    if (this.coverage !== 'Particular' && !this.affiliateNumber) {
      alert('Debes ingresar el número de afiliado');
      return;
    }

    
    try {
      await this.appt.bookSlot(this.date, this.time, {
        patientName: this.patientName,
        dni: this.dni,
        phone: this.phone,
        coverage: this.coverage,
        affiliateNumber: this.coverage !== 'Particular' ? this.affiliateNumber : null,
        date: this.date,
        time: this.time,
        reason: this.reason
      });
      
      alert('Turno agendado.');

      this.router.navigate(['/index']);

    } catch (e) {
      console.error(e);
    }
  }

  async onDateChange() {
    if (!this.date) return;

    // 🔥 importante: extraes solo horarios
    const slots = await this.appt.getAvailableSlotsByDate(this.date);

    // 🔥 filtro extra por seguridad
    const freeSlots = slots.filter((s: any) => s.status === 'free');

    this.availableSlots = freeSlots;

    this.horarios = freeSlots.map((s: any) => s.time);

    // reset selección anterior
    this.time = '';
  }
}
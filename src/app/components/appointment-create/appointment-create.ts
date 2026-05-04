import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './appointment-create.html',
  styleUrl: './appointment-create.css'
})
export class Appointment {

  coverage: string = 'Particular';
  date: string = '';
  time: string = '';
  reason: string = '';

  patientName: string = '';
  dni: string = '';
  phone: string = '';
  affiliateNumber: string = '';

  horarios: string[] = [
    '09:00', '09:30', '10:00',
    '10:30', '11:00',
    '14:00', '14:30', '15:00'
  ];

  constructor(private appt: AppointmentService) {}

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
      await this.appt.createAppointment({
        patientName: this.patientName,
        dni: this.dni,
        phone: this.phone,
        coverage: this.coverage,
        affiliateNumber: this.coverage !== 'Particular' ? this.affiliateNumber : null,
        date: this.date,
        time: this.time,
        reason: this.reason
      });

      alert('Turno creado');

    } catch (e) {
      console.error(e);
    }
  }
}
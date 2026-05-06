import { Component, OnInit } from '@angular/core';
import { AppointmentService } from '../../services/appointment.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  imports: [FormsModule]
})
export class Admin implements OnInit {

  appointments: any[] = [];

  searchType: string = 'date';
  searchValue: string = '';

  // 🔥 slots
  selectedDate: string = '';
  selectedDates: string[] = [];

  slotTimes: string = '';

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
  }

  // =========================
  // 🔍 BUSQUEDA
  // =========================

  async search() {

    if (!this.searchValue) {
      this.appointments = [];
      return;
    }

    if (this.searchType === 'date') {

      this.appointments =
        await this.appt.getAppointmentsByDate(this.searchValue);

    }

    if (this.searchType === 'dni') {

      const dniNumber = Number(this.searchValue);

      this.appointments =
        await this.appt.getAppointmentsByDni(dniNumber);

    }
  }

  onSearchTypeChange() {

    this.searchValue = '';
    this.appointments = [];

  }

  // =========================
  // 📅 SLOTS
  // =========================

  addDate() {

    if (!this.selectedDate) return;

    if (!this.selectedDates.includes(this.selectedDate)) {

      this.selectedDates.push(this.selectedDate);

    }

    this.selectedDate = '';
  }

  removeDate(date: string) {

    this.selectedDates =
      this.selectedDates.filter(d => d !== date);

  }

  async createSlots() {

    const times = this.slotTimes
      .split('\n')
      .map(x => x.trim())
      .filter(x => x);

    if (!this.selectedDates.length || !times.length) {

      alert('Completa fechas y horarios');
      return;

    }

    let created = 0;
    let skipped = 0;

    for (const date of this.selectedDates) {

      for (const time of times) {

        try {

          const ok = await this.appt.createSlot(date, time);

          if (ok) {
            created++;
          } else {
            skipped++;
          }

        } catch (e) {

          console.error(`Error creando ${date} ${time}`, e);

        }
      }
    }

    alert(`
Slots creados: ${created}
Slots existentes ignorados: ${skipped}
    `);

    this.selectedDates = [];
    this.slotTimes = '';
  }

  // =========================
  // 📋 APPOINTMENTS
  // =========================

  isPast(a: any) {

    return a.timestamp < Date.now();

  }

  async cancelar(a: any) {

    if (this.isPast(a)) return;

    await this.appt.cancelAppointment(a);

    this.appointments =
      this.appointments.filter(x => x.id !== a.id);

  }
}
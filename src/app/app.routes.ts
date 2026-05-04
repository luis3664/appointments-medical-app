import { Routes } from '@angular/router';
import { Index } from './components/index/index';
import { Appointment } from './components/appointment-create/appointment-create';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [

    // 🔁 redirect inicial
    { path: '', redirectTo: 'index', pathMatch: 'full' },

    // 🏠 index
    { path: 'index', component: Index },

    // 📅 turnos (PROTEGIDO)
    {
        path: 'appointments',
        component: Appointment,
        canActivate: [AuthGuard]
    },

    // 🧨 wildcard
    { path: '**', redirectTo: 'index' }
];
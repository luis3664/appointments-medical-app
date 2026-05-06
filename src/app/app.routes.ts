import { Routes } from '@angular/router';
import { Index } from './components/index/index';
import { Appointment } from './components/appointment-create/appointment-create';
import { AuthGuard } from './guards/auth.guard';
import { User } from './components/user/user';
import { Admin } from './components/admin/admin';
import { adminGuard } from './guards/admin.guard';

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

    {
        path: 'user',
        component: User,
        canActivate: [AuthGuard]
    },

    {
        path: 'admin',
        component: Admin,
        canActivate: [adminGuard]
    },

    // 🧨 wildcard
    { path: '**', redirectTo: 'index' }
];
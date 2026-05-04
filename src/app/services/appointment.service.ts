import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { CreateAppointmentInput } from '../models/appointment.model';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    constructor(
        private firestore: Firestore,
        private auth: Auth
    ) {}

    async createAppointment(data: CreateAppointmentInput) {
        const user = this.auth.currentUser;

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

            // 🔥 Combina fecha + hora (formato 24h)
        const date = new Date(`${data.date}T${data.time}:00`);

        const ref = collection(this.firestore, 'appointments');

        return await addDoc(ref, {
            userId: user.uid,
            appointmentDate: Timestamp.fromDate(date),
            reason: data.reason,
            createdAt: Date.now()
        });
    }
}
import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    constructor(
        private firestore: Firestore,
        private auth: Auth
    ) {}

    async createAppointment(data: any) {

        const user = this.auth.currentUser;

        if (!user) throw new Error('No user');

        const ref = collection(this.firestore, 'appointments');

        return addDoc(ref, {
        ...data,
        userId: user.uid,
        createdAt: Date.now()
        });
    }
}
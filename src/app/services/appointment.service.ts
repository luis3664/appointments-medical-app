import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, doc, setDoc, deleteDoc, runTransaction, query, where, orderBy, collectionGroup } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class AppointmentService {

    constructor(
        private firestore: Firestore,
        private auth: Auth
    ) {}

    async getAvailableSlotsByDate(date: string) {

        // fecha local correcta
        const today = new Date().toLocaleDateString('en-CA');

        // no mostrar fechas pasadas
        if (date < today) return [];

        const colRef = collection(this.firestore, 'slots', date, 'times');

        let snap;

        try {
            snap = await getDocs(colRef);
        } catch {
            return [];
        }

        const now = new Date();
        const slots: any[] = [];

        for (const d of snap.docs) {

            const data = d.data();
            const time = d.id;

            const slotDateTime = new Date(date + ' ' + time);

            // 🔥 solo filtrar (NO borrar)
            if (slotDateTime < now) continue;

            if (data['status'] === 'free') {
            slots.push({ time, ...data });
            }
        }

        return slots;
    }

    async createSlot(date: string, time: string) {

        const ref =
        doc(this.firestore, 'slots', date, 'times', time);

        // 🔥 verificar si existe
        const snap = await getDocs(
        query(
            collection(this.firestore, 'slots', date, 'times'),
            where('__name__', '==', time)
        )
        );

        if (!snap.empty) {

        console.log(`Slot ya existe: ${date} ${time}`);
        return false;

        }

        const slotDate = new Date(`${date}T${time}:00`);

        const expiresAt = new Date(slotDate);
        expiresAt.setDate(expiresAt.getDate() + 1);

        await setDoc(ref, {

            status: 'free',
            userId: null,
            timestamp: slotDate.getTime(),
            createdAt: Date.now(),
            expiresAt: expiresAt

        });

        return true;
    }

    async getSlotsByDate(date: string) {

        const ref =
        collection(this.firestore, 'slots', date, 'times');

        const snap = await getDocs(ref);

        return snap.docs.map(d => ({
            time: d.id,
            date: date,
            ...d.data()
        }))
        .sort((a: any, b: any) =>
            a.time.localeCompare(b.time)
        );
    }

    async deleteSlot(date: string, time: string) {

        const ref =
        doc(this.firestore, 'slots', date, 'times', time);

        await deleteDoc(ref);

    }

    async getAppointmentByDateAndTime(
        date: string,
        time: string
    ) {

        const q = query(
            collection(this.firestore, 'appointments'),
            where('date', '==', date),
            where('time', '==', time)
        );

        const snap = await getDocs(q);

        if (snap.empty) return null;

        return {
            id: snap.docs[0].id,
            ...snap.docs[0].data()
        };
    }

    async bookSlot(date: string, time: string, data: any) {

        const user = this.auth.currentUser;
        if (!user) throw new Error('No user');

        const slotRef = doc(this.firestore, 'slots', date, 'times', time);
        const apptRef = collection(this.firestore, 'appointments');

        await runTransaction(this.firestore, async (transaction) => {

            const slotSnap = await transaction.get(slotRef);

            if (!slotSnap.exists()) {
            throw new Error('Slot no existe');
            }

            const slotData = slotSnap.data();

            if (slotData['status'] !== 'free') {
            throw new Error('Turno ya ocupado');
            }

            // 🔥 marcar como ocupado
            transaction.update(slotRef, {
            status: 'booked',
            userId: user.uid
            });

            // 🔥 crear appointment
            const dateTime = new Date(`${data.date}T${data.time}:00`);

            transaction.set(doc(apptRef), {
                ...data,
                userId: user.uid,
                userEmail: user.email,
                accountName: user.displayName || '',
                timestamp: dateTime.getTime(),
                createdAt: Date.now()
            });

        });

    }

    async cancelAppointment(a: any) {

        const slotRef = doc(this.firestore, 'slots', a.date, 'times', a.time);

        await runTransaction(this.firestore, async (transaction) => {

            // 🔥 liberar slot
            transaction.update(slotRef, {
            status: 'free',
            userId: null
            });

            // 🔥 borrar appointment
            const apptRef = doc(this.firestore, 'appointments', a.id);
            transaction.delete(apptRef);

        });

    }

    async getUserAppointments() {

        const user = this.auth.currentUser;
        if (!user) throw new Error('No user');

        const q = query(
            collection(this.firestore, 'appointments'),
            where('userId', '==', user.uid),
            orderBy('timestamp', 'desc')
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));
    }

    async getAllAppointments() {
        const q = query(
            collection(this.firestore, 'appointments'),
            orderBy('timestamp', 'desc')
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({
            id: d.id,
            ...d.data()
        }));
    }

    async deleteExpiredSlots() {

        const now = new Date();

        // 🔥 busca TODOS los slots expirados en todas las fechas
        const q = query(
            collectionGroup(this.firestore, 'times'),
            where('expiresAt', '<=', now)
        );

        let snap;

        try {
            snap = await getDocs(q);
        } catch (e) {
            console.error('Error obteniendo slots expirados', e);
            return;
        }

        const deletes: Promise<any>[] = [];

        for (const d of snap.docs) {
            deletes.push(deleteDoc(d.ref));
        }

        if (deletes.length) {
            await Promise.all(deletes);
        }

        console.log(`🧨 Slots eliminados: ${deletes.length}`);
    }

    async getAppointmentsByDate(date: string) {

        const ref = collection(this.firestore, 'appointments');

        const q = query(
            ref,
            where('date', '==', date),
            orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    async getAppointmentsByDni(dni: number) {

        const ref = collection(this.firestore, 'appointments');

        const q = query(
            ref,
            where('dni', '==', dni),
            orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }

    async getAppointmentsByName(name: string) {

        const ref = collection(this.firestore, 'appointments');

        const q = query(
            ref,
            where('patientName', '==', name),
            orderBy('createdAt', 'desc')
        );

        const snap = await getDocs(q);

        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
}
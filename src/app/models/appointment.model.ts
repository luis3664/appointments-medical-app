export interface Appointment {
    id?: string;
    userId: string;
    appointmentDate: any; // Timestamp
    reason: string;
    createdAt: number;
}

// 👉 Input desde el formulario
export interface CreateAppointmentInput {
    userId: string;
    date: string;   // "2026-05-10"
    time: string;   // "14:30"
    reason: string;
}
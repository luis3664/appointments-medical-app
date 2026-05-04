export interface Appointment {
    id?: string;
    userId: string;
    patientName: string;
    dni: string;
    phone: string;
    coverage: string;
    affiliateNumber?: string;
    date: string;
    time: string;
    reason: string;
    createdAt: number;
}

// 👉 Input desde el formulario
export interface CreateAppointmentInput {
    date: string;   // "2026-05-10"
    time: string;   // "14:30"
    reason: string;
}
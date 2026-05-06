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
};
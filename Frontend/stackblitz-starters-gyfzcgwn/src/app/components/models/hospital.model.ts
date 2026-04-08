export interface Hospital {
    name: string;
    address: string;

    phone?: string | null;
    description?: string | null;
    image?: string | null;

    lat?: number;
    lng?: number;
    distanceKm?: number;
    rating?: number;

    emergency?: boolean;   // VERY IMPORTANT ? must be optional
}
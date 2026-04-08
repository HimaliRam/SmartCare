import { Injectable } from '@angular/core';
import { Hospital } from '../components/models/hospital.model';

@Injectable({ providedIn: 'root' })
export class HospitalStateService {

    private hospitals: Hospital[] | null = null;
    private selectedHospital: Hospital | null = null;

    setHospitals(hospitals: Hospital[]): void {
        this.hospitals = hospitals;
    }

    getHospitals(): Hospital[] | null {
        return this.hospitals;
    }

    setHospital(hospital: Hospital): void {
        this.selectedHospital = hospital;
    }

    getHospital(): Hospital | null {
        return this.selectedHospital;
    }

    clear(): void {
        this.hospitals = null;
        this.selectedHospital = null;
    }
}
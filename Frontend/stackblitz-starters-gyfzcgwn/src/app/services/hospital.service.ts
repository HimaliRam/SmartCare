import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Hospital } from '../components/models/hospital.model';


@Injectable({
    providedIn: 'root'
})
export class HospitalService {

    private apiUrl = 'http://localhost:5116/api/hospitals';

    constructor(private http: HttpClient) { }

    getNearbyHospitals(lat: number, lng: number): Observable<Hospital[]> {
        return this.http
            .get<Hospital[]>(`${this.apiUrl}/nearby?lat=${lat}&lng=${lng}`)
            .pipe(
                map(data => Array.isArray(data) ? data : [])
            );
    }
}
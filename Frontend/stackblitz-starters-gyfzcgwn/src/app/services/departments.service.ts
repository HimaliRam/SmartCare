import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Doctor } from '../models/doctor.model'

@Injectable({
    providedIn: 'root'
})
export class DepartmentsService {

    private api = "http://localhost:5116/api/departments"

    constructor(private http: HttpClient) { }

    getDoctors(lat: number, lng: number, specialization: string): Observable<Doctor[]> {

        return this.http.get<Doctor[]>(
            `${this.api}/nearby-specialists`,
            {
                params: {
                    lat: lat,
                    lng: lng,
                    specialization: specialization
                }
            }
        )

    }

}
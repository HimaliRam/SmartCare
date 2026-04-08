import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DoctorService {

    private api = "http://localhost:5116/api";

    constructor(private http: HttpClient) { }

    getDoctors(route: string, cityId: number) {

        return this.http.get(
            `${this.api}/DepartmentDoctors?departmentRoute=${route}&cityId=${cityId}`
        );

    }
}
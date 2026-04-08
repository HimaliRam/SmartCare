import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HealthService {

    private apiUrl = 'http://localhost:5116/api/health';

    constructor(private http: HttpClient) { }

    getHealth(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${userId}`);
    }
}
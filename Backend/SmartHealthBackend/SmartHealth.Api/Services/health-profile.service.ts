import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HealthProfileService {

    private baseUrl = 'http://localhost:5116/api/health-profile';

    constructor(private http: HttpClient) { }

    fetchProfile(email: string): Observable<any> {
        const url = `${this.baseUrl}/${encodeURIComponent(email)}`; // Encode email
        return this.http.get(url).pipe(
            catchError(err => {
                console.error('Failed to fetch profile', err);
                throw err;
            })
        );
    }
}
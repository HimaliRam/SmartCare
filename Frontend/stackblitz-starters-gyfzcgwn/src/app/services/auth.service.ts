import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'http://localhost:5116/api/User';

    constructor(private http: HttpClient) { }

    // ? REGISTER
    register(user: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/Register`, user);
    }

    // ? LOGIN (ADD THIS ??)
    login(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/Login`, data);
    }

    // ? GET USER FROM STORAGE
    getUser() {
        const user = localStorage.getItem('user');
        return user && user !== 'undefined' ? JSON.parse(user) : null;
    }
    updateProfile(data: any) {
        return this.http.put('http://localhost:5116/api/User/update', data);
    }

    deleteAccount(id: number) {
        return this.http.delete(`http://localhost:5116/api/User/delete/${id}`);
    }
    getUserById(id: number) {
        return this.http.get(`http://localhost:5116/api/User/${id}`);
    }

    // ? CHECK LOGIN
    isLoggedIn(): boolean {
        const user = localStorage.getItem('user');
        return user !== null && user !== 'undefined';
    }
    // ? LOGOUT
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}



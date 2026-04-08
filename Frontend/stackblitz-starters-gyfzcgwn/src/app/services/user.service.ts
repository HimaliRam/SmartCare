import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    // ?? Change port according to your backend
    private apiUrl = 'https://localhost:7032/api/User';

    private currentUser: any = null;

    constructor(private http: HttpClient) {
        const data = localStorage.getItem('smartcare_user');

        if (data) {
            this.currentUser = JSON.parse(data);
        }
    }

    // ? THIS METHOD WAS MISSING ? THIS FIXES YOUR ERROR
    registerUser(user: any) {
        return this.http.post('http://localhost:5116/api/auth/register', user);
    }
    // optional login method
    login(data: any) {
        return this.http.post(
            'http://localhost:5116/api/auth/login',
            data,
            // ?? VERY IMPORTANT
        );
    }

    checkEmail(email: string) {
        return this.http.post(
            'http://localhost:5116/api/auth/check-email',
            { email: email },   // ? SEND JSON OBJECT
            { headers: { 'Content-Type': 'application/json' } }
        );
    }

    sendOtp(email: string) {
        return this.http.post('http://localhost:5116/api/auth/send-otp', { email });
    }

    verifyOtp(data: any) {
        return this.http.post(
            'http://localhost:5116/api/auth/verify-otp', // ✅ FIXED PORT
            data
        );
    }
    resetPassword(data: any) {
        return this.http.post('http://localhost:5116/api/auth/reset-password', data);
    }

    setUser(user: any) {
        this.currentUser = user;

        localStorage.setItem('smartcare_user', JSON.stringify(user));
    }

    getUser() {
        return this.currentUser;
    }

    clearUser() {
        this.currentUser = null;

        localStorage.removeItem('smartcare_user');
    }

    isLoggedIn(): boolean {
        return this.currentUser !== null;
    }
}

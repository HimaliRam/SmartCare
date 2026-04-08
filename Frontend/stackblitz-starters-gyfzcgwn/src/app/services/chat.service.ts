import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private apiUrl = 'http://localhost:5116/api/chat';

    constructor(private http: HttpClient) { }

    // ✅ FIX: now accepts full messages array
    sendMessage(messages: any[]): Observable<any> {
        return this.http.post(this.apiUrl, {
            messages: messages
        });
    }
}
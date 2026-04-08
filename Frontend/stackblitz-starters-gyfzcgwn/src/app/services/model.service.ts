import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalService {

    private modalSubject = new BehaviorSubject<any>(null);
    modal$ = this.modalSubject.asObservable();

    open(data: any) {
        this.modalSubject.next(null); // ✅ force reset
        setTimeout(() => {
            this.modalSubject.next({ ...data }); // ✅ new object
        }, 0);
    }

    close() {
        this.modalSubject.next(null);
    }
}
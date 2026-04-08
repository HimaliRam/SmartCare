import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';

declare var bootstrap: any;

@Component({
    selector: 'app-find-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './find-doctors.component.html',
    styleUrls: ['./find-doctors.component.css']
})
export class FindDoctorsComponent implements OnInit {

    doctors: any[] = [];
    searchText: string = '';
    loading = true;

    userLat!: number;
    userLng!: number;

    selectedDoctor: any = null;
    searchSubject = new Subject<string>();

    appointment = {
        patientName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        symptoms: ''
    };

    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        window.scrollTo(0, 0);
        this.getUserLocation();

        this.searchSubject
            .pipe(debounceTime(400))
            .subscribe(() => {
                this.loadDoctors();
            });
    }

    getUserLocation() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLat = position.coords.latitude;
                this.userLng = position.coords.longitude;
                this.loadDoctors();
            },
            () => {
                this.userLat = 23.0225;
                this.userLng = 72.5714;
                this.loadDoctors();
            }
        );
    }

    loadDoctors() {
        this.loading = true;

        this.http.get<any[]>(
            'http://localhost:5116/api/doctors/nearby',
            {
                params: {
                    lat: this.userLat.toString(),
                    lng: this.userLng.toString(),
                    search: this.searchText || ''
                }
            }
        ).subscribe({
            next: (data) => {
                this.doctors = data;
                this.loading = false;
                this.cdr.detectChanges();


            },
            error: () => {
                this.loading = false;
                this.cdr.detectChanges();


            }
        });
    }

    onSearchChange() {
        this.searchSubject.next(this.searchText);
    }

    openAppointmentModal(doctor: any) {
        this.selectedDoctor = doctor;

        this.appointment = {
            patientName: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            symptoms: ''
        };

        this.errorMessage = '';
        this.successMessage = '';

        const modalElement = document.getElementById('appointmentModal');

        if (!modalElement) {
            console.error("Modal not found!");
            return;
        }

        if (typeof bootstrap === 'undefined') {
            console.error("Bootstrap JS not loaded!");
            return;
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }

    submitAppointment() {

        this.errorMessage = '';
        this.successMessage = '';

        // Name validation
        if (!this.appointment.patientName.trim()) {
            this.errorMessage = "Please enter patient name.";
            return;
        }

        this.appointment.email = this.appointment.email.trim().toLowerCase();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!emailRegex.test(this.appointment.email)) {
            this.errorMessage = "Please enter valid email address.";
            return;
        }

        // Phone validation
        if (!/^[0-9]{10}$/.test(this.appointment.phone)) {
            this.errorMessage = "Phone number must be exactly 10 digits.";
            return;
        }

        // Date validation
        const today = new Date();
        const selectedDate = new Date(this.appointment.date);
        today.setHours(0, 0, 0, 0);

        if (!this.appointment.date || selectedDate < today) {
            this.errorMessage = "Appointment date must be today or future date.";
            return;
        }

        // Time validation
        const [hours] = this.appointment.time.split(':').map(Number);

        if (hours < 5 || hours > 23) {
            this.errorMessage = "Booking time allowed only between 5:00 AM and 11:00 PM.";
            return;
        }

        // Symptoms validation
        if (!this.appointment.symptoms.trim()) {
            this.errorMessage = "Please describe your symptoms.";
            return;
        }

        const payload = {
            patientName: this.appointment.patientName,
            email: this.appointment.email,
            phone: this.appointment.phone,
            date: new Date(this.appointment.date),
            time: this.appointment.time,
            symptoms: this.appointment.symptoms,
            doctorId: this.selectedDoctor.id
        };

        this.http.post(
            'http://localhost:5116/api/Appointments',
            payload
        ).subscribe({
            next: () => {

                // Show success message
                this.successMessage = "Appointment booked successfully!";

                // Force Angular UI update
                this.cdr.detectChanges();

                // Reset form
                this.appointment = {
                    patientName: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    symptoms: ''
                };

                // Auto close modal after 2 seconds
                setTimeout(() => {
                    const modalElement = document.getElementById('appointmentModal');
                    const modalInstance = bootstrap.Modal.getInstance(modalElement);
                    modalInstance?.hide();
                }, 1500);
            },

            error: (err) => {
                console.error(err);
                this.errorMessage = "Server error while booking appointment.";
                this.cdr.detectChanges();
            }
        });
    }

}
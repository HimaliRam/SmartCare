import { Component, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare var bootstrap: any;

@Component({
    selector: 'app-department-doctors',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './department-doctors.component.html',
    styleUrls: ['./department-doctors.component.css']
})
export class DepartmentDoctorsComponent {

    doctors: any[] = [];

    selectedDoctor: any;
    departmentColor: string = '#0d9488';
    errorMessage = "";
    successMessage = "";
    departmentTitle: string = "";

    latitude: number = 0;
    longitude: number = 0;

    appointment = {
        patientName: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        symptoms: ''
    };

    constructor(
        private route: ActivatedRoute,
        private doctorService: DoctorService,
        private http: HttpClient,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {

        this.route.params.subscribe(params => {

            const departmentRoute = params['departmentRoute'];

            this.departmentTitle =
                departmentRoute.charAt(0).toUpperCase() +
                departmentRoute.slice(1) +
                " Specialists";

            // get user location first
            this.getUserLocation(departmentRoute);

        });

        // read color
        this.route.queryParams.subscribe(q => {
            if (q['color']) {
                this.departmentColor = q['color'];
            }
        });

    }

    // =============================
    // GET USER LOCATION
    // =============================
    getUserLocation(departmentRoute: string) {

        if (!navigator.geolocation) {
            console.warn("Geolocation not supported");
            this.loadDoctors(departmentRoute);
            return;
        }

        navigator.geolocation.getCurrentPosition(

            (position) => {

                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;

                console.log("User Location:", this.latitude, this.longitude);

                this.loadDoctors(departmentRoute);

            },

            (error) => {

                console.warn("Location permission denied");

                // fallback: get last stored location
                const lat = localStorage.getItem("userLat");
                const lng = localStorage.getItem("userLng");

                if (lat && lng) {

                    this.latitude = Number(lat);
                    this.longitude = Number(lng);

                }

                this.loadDoctors(departmentRoute);

            }

        );

    }

    // =============================
    // LOAD DOCTORS
    // =============================
    loadDoctors(departmentRoute: string) {

        // Fix capitalization
        const search = departmentRoute
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        const url =
            `http://localhost:5116/api/Doctors/nearby?lat=${this.latitude}&lng=${this.longitude}&search=${search}`;

        this.http.get<any[]>(url).subscribe({

            next: (res) => {

                console.log("Doctors:", res);

                this.doctors = res
                    .sort((a, b) => a.distance - b.distance)
                    .map(d => ({
                        id: d.id,
                        name: d.name,
                        degree: d.degree,
                        specialization: d.specialization,
                        hospital: d.hospital,
                        experience: d.experience,
                        rating: d.rating
                    }));

                // Force UI refresh
                this.cdr.detectChanges();
            },
            error: (err) => {

                console.error(err);

                this.errorMessage = "Unable to load doctors.";
            }

        });

    }
    openAppointmentModal(doctor: any) {

        this.selectedDoctor = doctor;

        this.errorMessage = "";
        this.successMessage = "";

        setTimeout(() => {
            const modalEl = document.getElementById('appointmentModal');

            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        }, 0);
    }

    submitAppointment() {

        this.errorMessage = "";
        this.successMessage = "";

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

        if (!/^[0-9]{10}$/.test(this.appointment.phone)) {
            this.errorMessage = "Phone number must be 10 digits.";
            return;
        }

        const today = new Date();
        const selectedDate = new Date(this.appointment.date);

        today.setHours(0, 0, 0, 0);

        if (!this.appointment.date || selectedDate < today) {
            this.errorMessage = "Appointment date must be today or future.";
            return;
        }

        const [hours] = this.appointment.time.split(':').map(Number);

        if (hours < 5 || hours > 23) {
            this.errorMessage = "Booking allowed between 5AM and 11PM.";
            return;
        }

        if (!this.appointment.symptoms.trim()) {
            this.errorMessage = "Please describe your symptoms.";
            return;
        }

        const payload = {
            patientName: this.appointment.patientName,
            email: this.appointment.email,
            phone: this.appointment.phone,
            date: this.appointment.date,
            time: this.appointment.time,
            symptoms: this.appointment.symptoms,
            doctorId: this.selectedDoctor.id
        };

        console.log("Sending Appointment:", payload);

        this.http.post(
            'http://localhost:5116/api/Appointments',
            payload
        ).subscribe({

            next: (res: any) => {

                console.log("Appointment Saved:", res);

                this.successMessage = "Appointment booked successfully!";
                this.errorMessage = "";

                this.cdr.detectChanges();

                this.appointment = {
                    patientName: '',
                    email: '',
                    phone: '',
                    date: '',
                    time: '',
                    symptoms: ''
                };

                setTimeout(() => {

                    const modalEl = document.getElementById('appointmentModal');
                    const modal = bootstrap.Modal.getInstance(modalEl);

                    if (modal) {
                        modal.hide();
                    }

                    this.successMessage = "";

                }, 1500);

            },

            error: (err) => {

                console.error(err);

                this.errorMessage = "Failed to book appointment.";
                this.successMessage = "";

                this.cdr.detectChanges();

            }

        });

    }

}
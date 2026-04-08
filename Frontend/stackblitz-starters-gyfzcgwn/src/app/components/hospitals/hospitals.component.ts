import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Hospital } from '../models/hospital.model';
import { HospitalService } from '../../services/hospital.service';
import { HospitalStateService } from '../../services/hospital-state.service';
import { ChangeDetectorRef } from '@angular/core';



@Component({
    selector: 'app-hospitals',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hospitals.component.html',
    styleUrls: ['./hospitals.component.css'],
})
export class HospitalsComponent implements OnInit {

    locationEnabled = false;
    loading = false;

    hospitals: Hospital[] = [];
    firstThree: Hospital[] = [];

    userLat!: number;
    userLng!: number;

    mapUrl!: SafeResourceUrl;

    constructor(
        private router: Router,
        private hospitalService: HospitalService,
        private hospitalState: HospitalStateService,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        const savedLoc = localStorage.getItem('userLocation');
        const cachedHospitals = this.hospitalState.getHospitals();

        if (savedLoc) {
            const loc = JSON.parse(savedLoc);
            this.userLat = loc.lat;
            this.userLng = loc.lng;
            this.locationEnabled = true;

            // ? SHOW MAP IMMEDIATELY
            this.setMap();
        }

        if (cachedHospitals && cachedHospitals.length) {
            this.hospitals = cachedHospitals;
            this.firstThree = cachedHospitals.slice(0, 3);
            return; // ? NO API CALL
        }

        // ?? If map shown but hospitals not cached ? fetch
        if (savedLoc) {
            this.fetchHospitals();
        }
    }
    enableLocation(): void {
        if (this.loading) return;

        this.loading = true;

        navigator.geolocation.getCurrentPosition(
            pos => {
                this.userLat = pos.coords.latitude;
                this.userLng = pos.coords.longitude;

                // ? SAVE immediately
                localStorage.setItem(
                    'userLocation',
                    JSON.stringify({ lat: this.userLat, lng: this.userLng })
                );

                this.locationEnabled = true;

                // ? MAP FIRST (instant)
                this.setMap();

                // ? FETCH DATA PARALLEL
                this.fetchHospitals();
            },
            () => {
                this.loading = false;
            },
            {
                enableHighAccuracy: false,   // ?? MUCH FASTER
                timeout: 1500,               // ? max 1.5 sec
                maximumAge: 60000            // ? reuse cached GPS
            }
        );
    }

    private setMap(): void {
        const url = `https://www.google.com/maps?q=${this.userLat},${this.userLng}&z=13&output=embed`;
        this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    fetchHospitals(): void {
        this.loading = true;

        this.hospitalService
            .getNearbyHospitals(this.userLat, this.userLng)
            .subscribe({
                next: (data) => {
                    this.hospitals = data;
                    this.firstThree = data.slice(0, 3);

                    this.hospitalState.setHospitals(data);

                    this.loading = false;

                    // ?? FORCE UI UPDATE
                    setTimeout(() => {
                        this.cdr.detectChanges();
                    }, 0);
                },
                error: () => {
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });
    }
    private calculateDistance(
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ): number {
        const R = 6371;
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(this.deg2rad(lat1)) *
            Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return Math.round(2 * R * Math.asin(Math.sqrt(a)) * 10) / 10;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    viewDetails(hospital: Hospital): void {
        this.hospitalState.setHospital(hospital);
        this.router.navigate(['/hospital-details']);
    }

    viewMore(): void {
        this.router.navigate(['/all-hospitals']);
    }
    trackByHospital(index: number, hospital: Hospital) {
        return hospital.name;
    }
}
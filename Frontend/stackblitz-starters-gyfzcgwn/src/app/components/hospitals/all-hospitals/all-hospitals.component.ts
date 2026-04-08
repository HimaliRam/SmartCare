import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Hospital } from '../../models/hospital.model';
import { HospitalStateService } from '../../../services/hospital-state.service';

@Component({
    selector: 'app-all-hospitals',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './all-hospitals.component.html',
    styleUrls: ['./all-hospitals.component.css']
})
export class AllHospitalsComponent {

    hospitals: Hospital[] = [];

    constructor(
        private state: HospitalStateService,
        private router: Router
    ) {
        this.hospitals = this.state.getHospitals() ?? [];
    }

    viewDetails(h: Hospital): void {
        this.state.setHospital(h);
        this.router.navigate(['/hospital-details']);
    }
}
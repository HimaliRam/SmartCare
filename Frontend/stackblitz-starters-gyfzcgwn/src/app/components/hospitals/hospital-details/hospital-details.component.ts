import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { HospitalStateService } from '../../../services/hospital-state.service';

@Component({
    selector: 'app-hospital-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hospital-details.component.html',
    styleUrls: ['./hospital-details.component.css'],
})
export class HospitalDetailsComponent {

    hospital: any;

    // ? SAFE IMAGE (NO BLOCKING)

    constructor(
        private location: Location,
        private hospitalState: HospitalStateService
    ) {
        this.hospital = this.hospitalState.getHospital();

        if (!this.hospital) {
            this.location.back();
        }
    }



    goBack() {
        this.location.back();
    }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nearby-hospitals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nearby-hospitals.component.html',
  styleUrls: ['./nearby-hospitals.component.css'],
})
export class NearbyHospitalsComponent implements OnInit {
  hospitals: any[] = [];

  ngOnInit(): void {
    // Dummy professional data
    this.hospitals = [
      {
        name: 'City Care Multispeciality Hospital',

        distance: '1.2 km',
        rating: 4.6,
        emergency: true,
        address: 'MG Road, Andheri East, Mumbai',
      },
      {
        name: 'Sunrise Heart Institute',

        distance: '2.8 km',
        rating: 4.2,
        emergency: false,
        address: 'Link Road, Malad West, Mumbai',
      },
      {
        name: 'Green Valley Hospital',

        distance: '3.5 km',
        rating: 4.8,
        emergency: true,
        address: 'SV Road, Goregaon East, Mumbai',
      },
    ];

    window.scrollTo(0, 0);
  }
  activeEmergencyIndex: number | null = null;

  activateEmergency(index: number) {
    this.activeEmergencyIndex = index;
  }
}

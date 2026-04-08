import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.css']
})
export class EmergencyComponent {

  locationMessage = '';

  enableLocation() {
    if (!navigator.geolocation) {
      this.locationMessage = 'Geolocation not supported in this browser.';
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.locationMessage =
          `Location detected ✅ Lat: ${position.coords.latitude.toFixed(2)},
           Lng: ${position.coords.longitude.toFixed(2)}`;
      },
      () => {
        this.locationMessage = 'Location access denied ❌';
      }
    );
  }
}

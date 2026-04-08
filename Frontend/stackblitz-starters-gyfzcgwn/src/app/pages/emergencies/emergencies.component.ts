import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emergency',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emergencies.component.html',
  styleUrls: ['./emergencies.component.css'],
})
export class EmergencyComponent {

  showAlert = false;
  requestSubmitted = false;

  emergencyData = {
    name: '',
    phone: '',
    location: '',
    type: '',
    bloodGroup: '',
  };

  triggerSOS() {
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
      alert('🚑 Emergency Alert Sent! Ambulance is on the way.');
    }, 2000);
  }

  submitRequest() {
    if (
      this.emergencyData.name &&
      this.emergencyData.phone &&
      this.emergencyData.location &&
      this.emergencyData.type
    ) {
      this.requestSubmitted = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert('Please fill all required fields!');
    }
  }

  resetForm() {
    this.requestSubmitted = false;
    this.emergencyData = {
      name: '',
      phone: '',
      location: '',
      type: '',
      bloodGroup: '',
    };
  }
}

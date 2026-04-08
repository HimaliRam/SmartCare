import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Doctor } from '../../../components/models/doctor.model';

@Component({
  selector: 'app-oncologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './oncologist.component.html',
  styleUrls: ['./oncologist.component.css']
})
export class OncologistComponent implements OnInit, AfterViewInit {

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchText = '';

  observer!: IntersectionObserver;
  alreadyAnimated = new Set<Element>();

  @ViewChildren('doctorCard', { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {

    this.viewportScroller.scrollToPosition([0, 0]);

    this.doctors = [

      {
        id: 1,
        name: 'Dr. Anjali Mehta',
        degree: 'MBBS, MD Oncology',
        hospital: 'Tata Memorial Hospital, Mumbai',
        experience: 16,
        specialization: 'Breast Cancer Specialist',
        image: 'https://randomuser.me/api/portraits/women/12.jpg'
      },

      {
        id: 2,
        name: 'Dr. Rajiv Kapoor',
        degree: 'MBBS, DM Medical Oncology',
        hospital: 'AIIMS, Delhi',
        experience: 20,
        specialization: 'Lung Cancer Specialist',
        image: 'https://randomuser.me/api/portraits/men/22.jpg'
      },

      {
        id: 3,
        name: 'Dr. Neha Sharma',
        degree: 'MBBS, MD Oncology',
        hospital: 'Apollo Hospital, Chennai',
        experience: 14,
        specialization: 'Radiation Oncologist',
        image: 'https://randomuser.me/api/portraits/women/32.jpg'
      },

      {
        id: 4,
        name: 'Dr. Vikram Singh',
        degree: 'MBBS, MCh Surgical Oncology',
        hospital: 'Fortis Hospital, Bangalore',
        experience: 18,
        specialization: 'Surgical Oncologist',
        image: 'https://randomuser.me/api/portraits/men/42.jpg'
      }

    ];

    this.filteredDoctors = [...this.doctors];
  }

  onSearch(): void {

    const value = this.searchText.toLowerCase();

    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(value) ||
      d.degree.toLowerCase().includes(value) ||
      d.hospital.toLowerCase().includes(value) ||
      d.specialization.toLowerCase().includes(value)
    );

    setTimeout(() => this.observeCards(), 50);
  }

  ngAfterViewInit(): void {
    this.createObserver();
    this.cards.changes.subscribe(() => this.observeCards());
    this.observeCards();
  }

  createObserver(): void {

    this.observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          if (!this.alreadyAnimated.has(entry.target)) {
            entry.target.classList.add('show');
            this.alreadyAnimated.add(entry.target);
          }

          this.observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

  }

  observeCards(): void {

    this.cards.forEach((card, index) => {

      const element = card.nativeElement;

      element.classList.remove('left', 'right');

      if (index % 2 === 0) {
        element.classList.add('left');
      } else {
        element.classList.add('right');
      }

      if (!this.alreadyAnimated.has(element)) {
        this.observer.observe(element);
      }

    });

  }

}

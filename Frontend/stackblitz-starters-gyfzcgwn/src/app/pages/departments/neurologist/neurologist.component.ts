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
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-neurologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './neurologist.component.html',
  styleUrls: ['./neurologist.component.css']
})
export class NeurologistComponent implements OnInit, AfterViewInit {

  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchText: string = '';

  observer!: IntersectionObserver;
  alreadyAnimated = new Set<Element>();

  @ViewChildren('doctorCard', { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(
    private doctorService: DoctorService,
    private viewportScroller: ViewportScroller
  ) {}

  // ================= INIT =================

  ngOnInit(): void {

    this.viewportScroller.scrollToPosition([0, 0]);

    // ✅ CLONE ARRAY (VERY IMPORTANT FIX)
    this.doctors = [...this.doctorService.getNeurologists()];

    // ✅ Add extra doctors (only to component copy)
    const extraDoctors: Doctor[] = [
      {
        id: 5,
        name: 'Dr. Vikram Singh',
        degree: 'MBBS, DM Neurology',
        hospital: 'Max Hospital, Delhi',
        experience: 11,
        specialization: 'Epilepsy Specialist',
        image: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      {
        id: 6,
        name: 'Dr. Anjali Desai',
        degree: 'MBBS, MD Neurology',
        hospital: 'Nanavati Hospital, Mumbai',
        experience: 8,
        specialization: 'Neuro Therapy',
        image: 'https://randomuser.me/api/portraits/women/65.jpg'
      },
      {
        id: 7,
        name: 'Dr. Karan Patel',
        degree: 'MBBS, DM Neurology',
        hospital: 'Sterling Hospital, Ahmedabad',
        experience: 10,
        specialization: 'Brain Stroke Specialist',
        image: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      {
        id: 8,
        name: 'Dr. Sneha Kapoor',
        degree: 'MBBS, MD Neurology',
        hospital: 'Apollo Hospital, Chennai',
        experience: 13,
        specialization: 'Neuro Surgeon',
        image: 'https://randomuser.me/api/portraits/women/32.jpg'
      }
    ];

    // merge without affecting service
    this.doctors = [...this.doctors, ...extraDoctors];

    this.filteredDoctors = [...this.doctors];
  }

  // ================= SEARCH =================

  onSearch(): void {

    const value = this.searchText.trim().toLowerCase();

    if (!value) {
      this.filteredDoctors = [...this.doctors];
    } else {
      this.filteredDoctors = this.doctors.filter(d =>
        d.name.toLowerCase().includes(value) ||
        d.degree.toLowerCase().includes(value) ||
        d.hospital.toLowerCase().includes(value) ||
        d.specialization.toLowerCase().includes(value)
      );
    }

    setTimeout(() => {
      this.observeCards();
    }, 50);
  }

  // ================= VIEW INIT =================

  ngAfterViewInit(): void {

    this.createObserver();

    this.cards.changes.subscribe(() => {
      this.observeCards();
    });

    this.observeCards();
  }

  // ================= OBSERVER =================

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

  // ================= OBSERVE =================

  observeCards(): void {

    if (!this.cards) return;

    this.cards.forEach(card => {

      const element = card.nativeElement;

      if (!this.alreadyAnimated.has(element)) {

        const rect = element.getBoundingClientRect();

        if (rect.top < window.innerHeight) {

          element.classList.add('show');
          this.alreadyAnimated.add(element);

        } else {

          this.observer.observe(element);

        }

      }

    });

  }

}

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
  selector: 'app-pathologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pathologist.component.html',
  styleUrls: ['./pathologist.component.css']
})
export class PathologistComponent implements OnInit, AfterViewInit {

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
        name: 'Dr. Mehul Shah',
        degree: 'MBBS, MD Pathology',
        hospital: 'Apollo Hospital, Ahmedabad',
        experience: 15,
        specialization: 'Clinical Pathologist',
        image: 'https://randomuser.me/api/portraits/men/55.jpg'
      },

      {
        id: 2,
        name: 'Dr. Priya Mehta',
        degree: 'MBBS, DCP',
        hospital: 'Zydus Hospital, Ahmedabad',
        experience: 12,
        specialization: 'Diagnostic Pathologist',
        image: 'https://randomuser.me/api/portraits/women/65.jpg'
      },

      {
        id: 3,
        name: 'Dr. Amit Patel',
        degree: 'MBBS, MD Laboratory Medicine',
        hospital: 'Sterling Hospital',
        experience: 18,
        specialization: 'Laboratory Specialist',
        image: 'https://randomuser.me/api/portraits/men/75.jpg'
      },

      {
        id: 4,
        name: 'Dr. Neha Shah',
        degree: 'MBBS, MD Pathology',
        hospital: 'Civil Hospital, Ahmedabad',
        experience: 10,
        specialization: 'Histopathologist',
        image: 'https://randomuser.me/api/portraits/women/85.jpg'
      },

      {
        id: 5,
        name: 'Dr. Rajesh Kumar',
        degree: 'MBBS, DNB Pathology',
        hospital: 'KD Hospital',
        experience: 14,
        specialization: 'Cytopathologist',
        image: 'https://randomuser.me/api/portraits/men/95.jpg'
      },

      {
        id: 6,
        name: 'Dr. Sneha Joshi',
        degree: 'MBBS, MD Microbiology',
        hospital: 'SAL Hospital',
        experience: 11,
        specialization: 'Microbiologist',
        image: 'https://randomuser.me/api/portraits/women/45.jpg'
      },

      {
        id: 7,
        name: 'Dr. Hardik Trivedi',
        degree: 'MBBS, MD Pathology',
        hospital: 'Care Institute',
        experience: 17,
        specialization: 'Forensic Pathologist',
        image: 'https://randomuser.me/api/portraits/men/35.jpg'
      },

      {
        id: 8,
        name: 'Dr. Riya Desai',
        degree: 'MBBS, DCP',
        hospital: 'HCG Hospital',
        experience: 9,
        specialization: 'Blood Bank Specialist',
        image: 'https://randomuser.me/api/portraits/women/25.jpg'
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

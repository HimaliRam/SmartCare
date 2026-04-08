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
  selector: 'app-dermatologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dermatologist.component.html',
  styleUrls: ['./dermatologist.component.css']
})
export class DermatologistComponent implements OnInit, AfterViewInit {

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
        name: 'Dr. Riya Sharma',
        degree: 'MBBS, MD Dermatology',
        hospital: 'Apollo Hospital',
        experience: 12,
        specialization: 'Skin Specialist',
        image: 'https://randomuser.me/api/portraits/women/11.jpg'
      },
      {
        id: 2,
        name: 'Dr. Aman Verma',
        degree: 'MBBS, DDVL',
        hospital: 'Fortis Hospital',
        experience: 15,
        specialization: 'Hair & Laser Treatment',
        image: 'https://randomuser.me/api/portraits/men/21.jpg'
      },
      {
        id: 3,
        name: 'Dr. Sneha Patel',
        degree: 'MD Dermatology',
        hospital: 'Sterling Hospital',
        experience: 10,
        specialization: 'Cosmetic Dermatologist',
        image: 'https://randomuser.me/api/portraits/women/31.jpg'
      },
      {
        id: 4,
        name: 'Dr. Rahul Mehta',
        degree: 'MBBS, MD',
        hospital: 'Care Institute',
        experience: 18,
        specialization: 'Acne & Pigmentation Expert',
        image: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    ];

    this.filteredDoctors = [...this.doctors];
  }

  onSearch(): void {
    const value = this.searchText.toLowerCase();
    this.filteredDoctors = this.doctors.filter(d =>
      d.name.toLowerCase().includes(value) ||
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
          entry.target.classList.add('show');
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  }

  observeCards(): void {
    this.cards.forEach((card, index) => {
      const element = card.nativeElement;
      element.classList.remove('left', 'right');
      element.classList.add(index % 2 === 0 ? 'left' : 'right');
      this.observer.observe(element);
    });
  }
}

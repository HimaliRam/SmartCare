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
  selector: 'app-psychologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './psychologist.component.html',
  styleUrls: ['./psychologist.component.css']
})
export class PsychologistComponent implements OnInit, AfterViewInit {

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
        name: 'Dr. Neha Kapoor',
        degree: 'MA Psychology',
        hospital: 'Mind Care Clinic',
        experience: 14,
        specialization: 'Clinical Psychologist',
        image: 'https://randomuser.me/api/portraits/women/51.jpg'
      },
      {
        id: 2,
        name: 'Dr. Arjun Singh',
        degree: 'PhD Psychology',
        hospital: 'Healing Minds',
        experience: 16,
        specialization: 'Child Psychologist',
        image: 'https://randomuser.me/api/portraits/men/61.jpg'
      },
      {
        id: 3,
        name: 'Dr. Priya Nair',
        degree: 'MA, MPhil',
        hospital: 'Fortis Hospital',
        experience: 12,
        specialization: 'Behavior Therapist',
        image: 'https://randomuser.me/api/portraits/women/71.jpg'
      },
      {
        id: 4,
        name: 'Dr. Rohit Verma',
        degree: 'PhD',
        hospital: 'Care Hospital',
        experience: 18,
        specialization: 'Counselling Psychologist',
        image: 'https://randomuser.me/api/portraits/men/81.jpg'
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

import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Doctor } from '../../../components/models/doctor.model';
import { DoctorService } from '../../../services/doctor.service';

@Component({
  selector: 'app-dentist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dentist.component.html',
  styleUrls: ['./dentist.component.css'],
})
export class DentistComponent implements OnInit, AfterViewInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchText = '';

  observer!: IntersectionObserver;
  alreadyAnimated = new Set<Element>();

  @ViewChildren('doctorCard', { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(
    private doctorService: DoctorService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.doctors = this.doctorService.getDentists();

    this.filteredDoctors = [...this.doctors];
  }

  onSearch(): void {
    const value = this.searchText.toLowerCase();

    this.filteredDoctors = this.doctors.filter(
      (d) =>
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

    this.observer = new IntersectionObserver(
      (entries) => {
  
        entries.forEach((entry) => {
  
          if (entry.isIntersecting) {
  
            if (!this.alreadyAnimated.has(entry.target)) {
  
              entry.target.classList.add('show');
  
              this.alreadyAnimated.add(entry.target);
  
            }
  
            this.observer.unobserve(entry.target);
  
          }
  
        });
  
      },
      {
        threshold: 0.15
      }
    );
  
  }
  
  observeCards(): void {
    this.cards.forEach((card) => {
      const element = card.nativeElement;

      if (!this.alreadyAnimated.has(element)) {
        this.observer.observe(element);
      }
    });
  }
}

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Department {
    icon: string;
    name: string;
    color: string;
    route: string;
}

@Component({
    selector: 'app-departments',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './departments.component.html',
    styleUrls: ['./departments.component.css'],
})
export class DepartmentsComponent implements OnInit {

    @ViewChild('scrollContainer', { static: true })
    scrollContainer!: ElementRef;
    @ViewChild('manualWrapper', { static: true })
    manualWrapper!: ElementRef;
    originalDepartments: Department[] = [
        { icon: '🧠', name: 'Neurologist', color: '#f59e0b', route: 'neurologist' },
        { icon: '🦴', name: 'Orthopedic', color: '#8b5cf6', route: 'orthopedic' },
        { icon: '🦷', name: 'Dentist', color: '#06b6d4', route: 'dentist' },
        { icon: '❤️', name: 'Cardiologist', color: '#ef4444', route: 'cardiologist' },
        { icon: '👶', name: 'Pediatrician', color: '#10b981', route: 'pediatrician' },
        { icon: '👁️', name: 'Ophthalmologist', color: '#3b82f6', route: 'ophthalmologist' },
        { icon: '🫁', name: 'Pulmonologist', color: '#14b8a6', route: 'pulmonologist' },
        { icon: '🩺', name: 'General Physician', color: '#6366f1', route: 'general-physician' },
        { icon: '🧬', name: 'Oncologist', color: '#ec4899', route: 'oncologist' },
        { icon: '🧪', name: 'Pathologist', color: '#22c55e', route: 'pathologist' },
        { icon: '🦠', name: 'Dermatologist', color: '#f97316', route: 'dermatologist' },
        { icon: '🧘', name: 'Psychologist', color: '#0ea5e9', route: 'psychologist' },
        { icon: '🧑‍⚕️', name: 'Surgeon', color: '#9333ea', route: 'surgeon' },
    ];

    departments: Department[] = [];

    ngOnInit() {
        // duplicate 3 times to ensure no gap
        this.departments = [
            ...this.originalDepartments,
            ...this.originalDepartments,
            ...this.originalDepartments
        ];
    }

    currentIndex = 0;
    cardWidth = 0;
    manualOffset = 0;
    autoScrollPaused = false;

    ngAfterViewInit() {
        setTimeout(() => {
            this.cardWidth = this.getCardWidth();
        });
    }

    private getCardWidth(): number {
        const container = this.scrollContainer.nativeElement as HTMLElement;
        const card = container.querySelector('.department-card') as HTMLElement;

        if (!card) return 200;

        const gap = 32; // 2rem gap
        return card.offsetWidth + gap;
    }

    moveNext() {
        const wrapper = this.manualWrapper.nativeElement as HTMLElement;

        const move = this.getCardWidth();

        this.manualOffset -= move;

        wrapper.style.transition = 'transform 0.5s ease';
        wrapper.style.transform = `translateX(${this.manualOffset}px)`;

        this.fixLoop(wrapper);
    }

    movePrev() {
        const wrapper = this.manualWrapper.nativeElement as HTMLElement;

        const move = this.getCardWidth();

        this.manualOffset += move;

        wrapper.style.transition = 'transform 0.5s ease';
        wrapper.style.transform = `translateX(${this.manualOffset}px)`;

        this.fixLoop(wrapper);
    }

    private fixLoop(wrapper: HTMLElement) {
        const track = this.scrollContainer.nativeElement.querySelector('.slider-track') as HTMLElement;
        const totalWidth = track.scrollWidth / 3; // because we duplicated 3x

        // forward overflow
        if (Math.abs(this.manualOffset) >= totalWidth) {
            // reset immediately, no transition
            wrapper.style.transition = 'none';
            this.manualOffset = 0;
            wrapper.style.transform = `translateX(${this.manualOffset}px)`;
        }

        // backward overflow
        if (this.manualOffset > 0) {
            wrapper.style.transition = 'none';
            this.manualOffset = -totalWidth;
            wrapper.style.transform = `translateX(${this.manualOffset}px)`;
        }
    }
}  

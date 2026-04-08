import {
    Component,
    OnInit,
    AfterViewInit,
    ElementRef,
    QueryList,
    ViewChildren
} from '@angular/core'

import { CommonModule, ViewportScroller } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { ChangeDetectorRef } from '@angular/core';

import { Doctor } from '../../../models/doctor.model'
import { DepartmentsService } from '../../../services/departments.service'

@Component({
    selector: 'app-surgeon',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './surgeon.component.html',
    styleUrls: ['./surgeon.component.css']
})

export class SurgeonComponent implements OnInit, AfterViewInit {

    doctors: Doctor[] = []
    filteredDoctors: Doctor[] = []
    searchText = ''

    observer!: IntersectionObserver

    @ViewChildren('doctorCard', { read: ElementRef })
    cards!: QueryList<ElementRef>

    constructor(
        private viewportScroller: ViewportScroller,
        private departmentService: DepartmentsService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.viewportScroller.scrollToPosition([0, 0]);

        navigator.geolocation.getCurrentPosition(
            pos => {

                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;

                console.log("User location:", lat, lng);

                this.loadDoctors(lat, lng);

            },
            error => {

                console.log("Geolocation blocked ? using Ahmedabad");

                this.loadDoctors(23.0225, 72.5714);

            }
        );

    }


    loadDoctors(lat: number, lng: number) {

        this.departmentService
            .getDoctors(lat, lng, 'surgeon')
            .subscribe({

                next: (data) => {

                    console.log("Doctors:", data);

                    if (data.length === 0) {

                        console.log("Fallback to Ahmedabad");

                        this.departmentService
                            .getDoctors(23.0225, 72.5714, 'surgeon')
                            .subscribe(res => {

                                console.log("Fallback doctors:", res);

                                this.doctors = res.sort((a, b) => a.distance - b.distance);
                                this.filteredDoctors = [...this.doctors];

                                this.cd.detectChanges();

                            });

                    }
                    else {

                        this.doctors = data.sort((a, b) => a.distance - b.distance);
                        this.filteredDoctors = [...this.doctors];

                    }

                },

                error: err => {
                    console.error("API Error:", err);
                }

            });

    }
    onSearch(): void {

        const value = this.searchText.toLowerCase()

        this.filteredDoctors = this.doctors.filter(d =>
            d.name.toLowerCase().includes(value) ||
            d.specialization.toLowerCase().includes(value)
        )

    }

    ngAfterViewInit(): void {
        this.createObserver()
        this.cards.changes.subscribe(() => this.observeCards())
        this.observeCards()
    }

    createObserver(): void {

        this.observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add('show')
                    this.observer.unobserve(entry.target)
                }

            })

        }, { threshold: 0.1 })

    }

    observeCards(): void {

        this.cards.forEach((card, index) => {

            const element = card.nativeElement

            element.classList.remove('left', 'right')
            element.classList.add(index % 2 === 0 ? 'left' : 'right')

            this.observer.observe(element)

        })

    }

}
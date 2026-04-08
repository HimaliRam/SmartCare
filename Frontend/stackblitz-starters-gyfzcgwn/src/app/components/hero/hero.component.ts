import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-hero',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.css']
})
export class HeroComponent {

    searchQuery: string = '';

    constructor(private router: Router) { }

    performSearch() {

        const query = this.searchQuery.toLowerCase().trim();

        if (!query) {
            alert('Please enter search term');
            return;
        }

        // Doctor Departments
        if (query.includes('cardio') || query.includes('heart')) {

            this.router.navigate(
                ['/department/cardiologist'],
                { queryParams: { color: '#ef4444' } } // red
            );

        }
        else if (query.includes('dentist') || query.includes('teeth')) {

            this.router.navigate(
                ['/department/dentist'],
                { queryParams: { color: '#06b6d4' } } // orange
            );

        }
        else if (query.includes('neuro') || query.includes('headache')) {

            this.router.navigate(
                ['/department/neurologist'],
                { queryParams: { color: '#f59e0b' } } // indigo
            );

        }
        else if (query.includes('ortho') || query.includes('bone')) {

            this.router.navigate(
                ['/department/orthopedic'],
                { queryParams: { color: '#8b5cf6' } } // purple
            );

        }
        else if (query.includes('child') || query.includes('pediatric')) {

            this.router.navigate(
                ['/department/pediatrician'],
                { queryParams: { color: '#14b8a6' } } // teal
            );

        }
        else if (query.includes('eye')) {

            this.router.navigate(
                ['/department/ophthalmologist'],
                { queryParams: { color: '#3b82f6' } } // blue
            );

        }
        else if (query.includes('skin')) {

            this.router.navigate(
                ['/department/dermatologist'],
                { queryParams: { color: '#f97316' } } // pink
            );

        }
        else if (query.includes('lung')) {

            this.router.navigate(
                ['/department/pulmonologist'],
                { queryParams: { color: '#10b981' } } // green
            );

        }

        else if (query.includes('oncologist')) {

            this.router.navigate(
                ['/department/oncologist'],
                { queryParams: { color: '#ec4899' } } // pink
            );

        }

        else if (query.includes('general') || query.includes('fever')) {

            this.router.navigate(
                ['/department/general-physician'],
                { queryParams: { color: '#6366f1' } } // blue-violet
            );

        }

        // Hospital search
        else if (query.includes('hospital')) {

            this.router.navigate(['/nearby-hospitals']);

        }

        // Department page
        else if (query.includes('department')) {

            this.router.navigate(['/departments']);

        }

        // Find doctors page
        else if (query.includes('doctor')) {

            this.router.navigate(['/find-doctors']);

        }

        else {

            alert('No results found');

        }

        this.searchQuery = '';
    }
}

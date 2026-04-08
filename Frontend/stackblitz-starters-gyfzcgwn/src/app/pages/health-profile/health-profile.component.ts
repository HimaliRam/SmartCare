import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HealthService } from '../../services/health.service';
import Chart from 'chart.js/auto';


@Component({
    selector: 'app-health-profile',
    standalone: true,
    imports: [CommonModule, HttpClientModule],
    templateUrl: './health-profile.component.html',
    styleUrls: ['./health-profile.component.css'],
})
export class HealthProfileComponent implements OnInit {

    height = 0;
    weight = 0;
    heartRate = 75;
    age = 0;
    bmi = 0;
    bmiStatus = 'No Data';

    idealBMI = 0;
    idealHeartRate = 0;
    idealWeight = 0;
    idealHeight = 0;

    overallHealth = '';
    healthClass = '';
    healthReason = '';
    healthImprovement = '';   // ✅ FIXED (IMPORTANT)

    healthData: any[] = [];
    healthTips: string[] = [];

    loading = true;
    errorMessage = '';

    constructor(
        private healthService: HealthService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadHealthData();
    }
    initCharts() {

        const canvas = document.getElementById('healthChart') as HTMLCanvasElement;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        if ((window as any).healthChartInstance) {
            (window as any).healthChartInstance.destroy();
        }

        // ✅ REAL VALUES (NO NORMALIZATION)
        const userData = [
            this.bmi,
            this.heartRate,
            this.weight,
            this.height
        ];

        const idealData = [
            this.idealBMI,
            this.idealHeartRate,
            this.idealWeight,
            this.idealHeight
        ];

        const gradient1 = ctx!.createLinearGradient(0, 0, 0, 300);
        gradient1.addColorStop(0, 'rgba(37, 99, 235, 0.6)');
        gradient1.addColorStop(1, 'rgba(37, 99, 235, 0.05)');

        const gradient2 = ctx!.createLinearGradient(0, 0, 0, 300);
        gradient2.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
        gradient2.addColorStop(1, 'rgba(239, 68, 68, 0.05)');

        (window as any).healthChartInstance = new Chart(ctx!, {
            type: 'line',
            data: {
                labels: ['BMI', 'Heart', 'Weight', 'Height'],
                datasets: [
                    {
                        label: 'Your Health',
                        data: userData,
                        borderColor: '#2563eb',
                        backgroundColor: gradient1,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 6
                    },
                    {
                        label: 'Ideal Range',
                        data: idealData,
                        borderColor: '#ef4444',
                        backgroundColor: gradient2,
                        fill: true,
                        tension: 0.4,
                        borderDash: [6, 6],
                        pointRadius: 5
                    }
                ]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => {
                                const labels = ['BMI', 'Heart', 'Weight', 'Height'];

                                const userValues = [
                                    this.bmi,
                                    this.heartRate,
                                    this.weight,
                                    this.height
                                ];

                                const idealValues = [
                                    this.idealBMI,
                                    this.idealHeartRate,
                                    this.idealWeight,
                                    this.idealHeight
                                ];

                                if (ctx.datasetIndex === 0) {
                                    return `Your ${labels[ctx.dataIndex]}: ${userValues[ctx.dataIndex]}`;
                                } else {
                                    return `Ideal ${labels[ctx.dataIndex]}: ${idealValues[ctx.dataIndex]}`;
                                }
                            }
                        }
                    }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        max: 200   // ✅ IMPORTANT (to support height)
                    }
                }
            }
        });
    }
    onAgeChange(newAge: number) {

        this.age = newAge;

        console.log("UPDATED AGE:", this.age);

        // ✅ Recalculate everything
        this.calculateIdealValues();
        this.calculateOverallHealth();

        // ✅ Refresh chart
        setTimeout(() => {
            this.initCharts();
        }, 100);
    }

    loadHealthData() {

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = user?.id || user?.userId;

        if (!userId) {
            this.errorMessage = 'User not logged in';
            this.loading = false;
            return;
        }

        this.healthService.getHealth(userId).subscribe({

            next: (data: any) => {

                console.log("HEALTH DATA:", data);

                // ✅ BACKEND DATA
                this.height = data?.height ?? 0;
                this.weight = data?.weight ?? 0;
                this.heartRate = data?.heartRate ?? 75;

                // ✅ AGE COMES DIRECTLY FROM DB
                this.age = data?.age ?? 25;

                console.log("AGE:", this.age);

                // ✅ CALCULATIONS (CORRECT ORDER)
                this.calculateBMI();
                this.calculateIdealValues();
                this.calculateOverallHealth();
                this.prepareHealthData();
                this.generateTips();

                this.loading = false;

                this.cdr.detectChanges();

                setTimeout(() => {
                    this.initCharts();
                }, 100);
            },

            error: (err) => {
                console.error("HEALTH ERROR:", err);
                this.errorMessage = 'Failed to load health data';
                this.loading = false;
            }
        });
    }
    calculateAge(dob: string): number {
        if (!dob) return 25; // fallback

        const birthDate = new Date(dob);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();

        const m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }
    calculateIdealValues() {

        // 🔥 AGE 5–10
        if (this.age >= 5 && this.age <= 10) {
            this.idealBMI = 16;
            this.idealHeartRate = 90;
            this.idealHeight = 130;
            this.idealWeight = 25;
        }

        // 🔥 AGE 11–15
        else if (this.age >= 11 && this.age <= 15) {
            this.idealBMI = 18;
            this.idealHeartRate = 85;
            this.idealHeight = 150;
            this.idealWeight = 37;
        }

        // 🔥 AGE 16–20
        else if (this.age >= 16 && this.age <= 20) {
            this.idealBMI = 20;
            this.idealHeartRate = 78;
            this.idealHeight = 165;
            this.idealWeight = 50;
        }

        // 🔥 AGE 21–30
        else if (this.age >= 21 && this.age <= 30) {
            this.idealBMI = 22;
            this.idealHeartRate = 72;
            this.idealHeight = 170;
            this.idealWeight = 55;
        }

        // 🔥 AGE 31–40
        else if (this.age >= 31 && this.age <= 40) {
            this.idealBMI = 23;
            this.idealHeartRate = 72;
            this.idealHeight = 170;
            this.idealWeight = 68;
        }

        // 🔥 AGE 41–50
        else if (this.age >= 41 && this.age <= 50) {
            this.idealBMI = 24;
            this.idealHeartRate = 70;
            this.idealHeight = 168;
            this.idealWeight = 70;
        }

        // 🔥 AGE ABOVE 50
        else if (this.age > 50) {
            this.idealBMI = 25;
            this.idealHeartRate = 68;
            this.idealHeight = 165;
            this.idealWeight = 68;
        }

        // 🔥 DEFAULT (fallback)
        else {
            this.idealBMI = 22;
            this.idealHeartRate = 72;
            this.idealHeight = 170;
            this.idealWeight = 65;
        }
    }
    getWeightStatus(): string {

        if (!this.weight) return 'No data';

        const min = this.idealWeight - 5;
        const max = this.idealWeight + 5;

        if (this.weight < min) return 'Below ideal weight';
        if (this.weight > max) return 'Above ideal weight';

        return 'Ideal for your age';
    }


    getHeightStatus(): string {

        if (!this.height) return 'No data';

        const min = this.idealHeight - 10;
        const max = this.idealHeight + 10;

        if (this.height < min) return 'Below average height';
        if (this.height > max) return 'Above average height';

        return 'Healthy growth';
    }
    // ================= BMI =================
    calculateBMI() {
        if (this.height <= 0 || this.weight <= 0) {
            this.bmi = 0;
            this.bmiStatus = 'No Data';
            return;
        }

        const h = this.height / 100;
        this.bmi = +(this.weight / (h * h)).toFixed(1);

        if (this.bmi < 18.5) this.bmiStatus = 'Underweight';
        else if (this.bmi <= 24.9) this.bmiStatus = 'Normal';
        else if (this.bmi <= 29.9) this.bmiStatus = 'Overweight';
        else this.bmiStatus = 'Obese';
    }

    // ================= OVERALL HEALTH =================
    calculateOverallHealth() {

        const bmi = this.bmi;
        const hr = this.heartRate;

        // ✅ EXCELLENT
        if (bmi >= 18.5 && bmi <= 24.9 && hr >= 60 && hr <= 100) {
            this.overallHealth = 'Excellent';
            this.healthClass = 'good-text';

            this.healthReason =
                'BMI and heart rate are within healthy ranges.';

            this.healthImprovement =
                'Maintain diet, activity, and sleep routine.';
        }

        // ⚠️ MODERATE RISK
        else if ((bmi >= 25 && bmi <= 29.9) || hr < 60 || hr > 100) {
            this.overallHealth = 'Moderate Risk';
            this.healthClass = 'warning-text';

            if (bmi >= 25) {
                this.healthReason =
                    'BMI or heart rate is slightly outside ideal range.';

                this.healthImprovement =
                    'Increase daily activity and monitor regularly.';
            } else {
                this.healthReason =
                    'Your heart rate is outside the normal resting range, which may indicate stress or low fitness.';
                this.healthImprovement =
                    'Focus on stress reduction, hydration, and regular cardio exercise.';
            }
        }

        // ❌ HIGH RISK
        else {
            this.overallHealth = 'High Risk';
            this.healthClass = 'danger-text';

            if (bmi < 18.5) {
                this.healthReason =
                    'Health values indicate elevated medical risk.';

                this.healthImprovement =
                    'Consult a healthcare professional soon.';
            } else {
                this.healthReason =
                    'Your BMI and heart rate suggest elevated health risk.';
                this.healthImprovement =
                    'Medical consultation and structured lifestyle changes are strongly recommended.';
            }
        }
    }

    // ================= CHART =================
    prepareHealthData() {
        this.healthData = [
            { label: 'BMI', value: this.bmi, realValue: this.bmi },
            { label: 'Heart', value: this.heartRate || 10, realValue: this.heartRate },
            { label: 'Weight', value: this.weight || 10, realValue: this.weight },
            { label: 'Height', value: this.height / 2 || 10, realValue: this.height }
        ];
    }

    // ================= TIPS =================
    generateTips() {
        if (this.overallHealth === 'Excellent') {
            this.healthTips = [
                '✔ Your weight is appropriate for your height',
                '✔ Heart rate is stable',
                '✔ Continue balanced diet and exercise',
                '✔ Maintain 7–8 hours of sleep',
                '✔ Annual health check recommended'
            ];
        }
        else if (this.bmi < 18.5) {
            this.healthTips = [
                '✔ Increase protein-rich foods',
                '✔ Add healthy calories gradually',
                '✔ Strength training recommended',
                '✔ Avoid skipping meals',
                '✔ Nutrition consultation advised'
            ];
        }
        else if (this.bmi <= 29.9) {
            this.healthTips = [
                '✔ Reduce sugar & refined carbs',
                '✔ Daily 30-minute walking',
                '✔ Monitor weight weekly',
                '✔ Drink adequate water',
                '✔ Control portion sizes'
            ];
        }
        else {
            this.healthTips = [
                '✔ Consult a healthcare professional',
                '✔ Structured weight-loss plan needed',
                '✔ Daily cardio exercise',
                '✔ Avoid junk & sugary drinks',
                '✔ Regular monitoring essential'
            ];
        }
    }

}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DiagnosisResult {
    condition: string;
    severity: 'low' | 'medium' | 'high';
    advice: string;
}

@Component({
    selector: 'app-symptom-checker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './symptom-checker.component.html',
    styleUrls: ['./symptom-checker.component.css']
})
export class SymptomCheckerComponent {

    symptomsList: string[] = [
        'Fever',
        'Cough',
        'Headache',
        'Chest Pain',
        'Shortness of Breath',
        'Fatigue',
        'Nausea',
        'Vomiting',
        'Sore Throat',
        'Body Pain',
        'Dizziness',
        'High Blood Pressure',
        'Low Blood Pressure',
        'Rapid Heartbeat',
        'Abdominal Pain',
        'Diarrhea',
        'Loss of Appetite',
        'Anxiety',
        'Insomnia',
        'Sweating',
        'Blurred Vision',
        'Palpitations'
    ];

    selectedSymptoms: string[] = [];
    result: DiagnosisResult | null = null;

    toggleSymptom(symptom: string) {
        if (this.selectedSymptoms.includes(symptom)) {
            this.selectedSymptoms = this.selectedSymptoms.filter(s => s !== symptom);
        } else {
            this.selectedSymptoms.push(symptom);
        }
    }

    checkSymptoms() {
        const s = this.selectedSymptoms;

        if (s.length === 0) {
            this.result = {
                condition: 'No symptoms selected',
                severity: 'low',
                advice: 'Please select at least one symptom.'
            };
            return;
        }

        /* ================= HIGH SEVERITY ================= */

        if (
            (s.includes('Chest Pain') && s.includes('Shortness of Breath')) ||
            (s.includes('Chest Pain') && s.includes('Rapid Heartbeat')) ||
            (s.includes('Chest Pain') && s.includes('Palpitations'))
        ) {
            this.result = {
                condition: 'Possible Heart Attack / Cardiac Issue',
                severity: 'high',
                advice: 'Seek emergency medical help immediately.'
            };
            return;
        }

        if (
            s.includes('Blurred Vision') &&
            s.includes('Dizziness') &&
            s.includes('High Blood Pressure')
        ) {
            this.result = {
                condition: 'Hypertensive Emergency',
                severity: 'high',
                advice: 'Check BP urgently and consult a doctor immediately.'
            };
            return;
        }

        if (
            s.includes('Shortness of Breath') &&
            s.includes('Rapid Heartbeat') &&
            s.includes('Sweating')
        ) {
            this.result = {
                condition: 'Severe Anxiety / Cardiac Stress',
                severity: 'high',
                advice: 'Immediate medical evaluation recommended.'
            };
            return;
        }

        /* ================= MEDIUM SEVERITY ================= */

        if (
            s.includes('Fever') &&
            s.includes('Cough') &&
            s.includes('Sore Throat')
        ) {
            this.result = {
                condition: 'Respiratory Infection',
                severity: 'medium',
                advice: 'Rest, hydrate, and monitor symptoms.'
            };
            return;
        }

        if (
            s.includes('Abdominal Pain') &&
            s.includes('Nausea')
        ) {
            this.result = {
                condition: 'Stomach Infection / Gastritis',
                severity: 'medium',
                advice: 'Avoid spicy food and stay hydrated.'
            };
            return;
        }

        if (
            s.includes('Fatigue') &&
            s.includes('Loss of Appetite') &&
            s.includes('Body Pain')
        ) {
            this.result = {
                condition: 'General Weakness / Viral Fatigue',
                severity: 'medium',
                advice: 'Take rest and maintain nutrition.'
            };
            return;
        }

        if (
            s.includes('Headache') &&
            s.includes('Blurred Vision')
        ) {
            this.result = {
                condition: 'Eye Strain / Migraine',
                severity: 'medium',
                advice: 'Reduce screen time and rest your eyes.'
            };
            return;
        }

        /* ================= SMART SCORING SYSTEM ================= */

        let score = 0;

        const highRisk = ['Chest Pain', 'Shortness of Breath', 'Blurred Vision'];
        const mediumRisk = ['Fever', 'Vomiting', 'Diarrhea', 'Rapid Heartbeat'];
        const lowRisk = ['Fatigue', 'Headache', 'Anxiety', 'Insomnia'];

        s.forEach(symptom => {
            if (highRisk.includes(symptom)) score += 3;
            else if (mediumRisk.includes(symptom)) score += 2;
            else if (lowRisk.includes(symptom)) score += 1;
        });

        /* ================= DYNAMIC RESULT ================= */

        if (score >= 6) {
            this.result = {
                condition: 'Potential Serious Condition',
                severity: 'high',
                advice: 'Multiple concerning symptoms detected. Consult doctor urgently.'
            };
        }
        else if (score >= 3) {
            this.result = {
                condition: 'Moderate Health Issue',
                severity: 'medium',
                advice: 'Monitor symptoms and consider medical advice.'
            };
        }
        else {
            this.result = {
                condition: 'Mild Condition',
                severity: 'low',
                advice: 'Rest and observe symptoms.'
            };
        }
    }

    reset() {
        this.selectedSymptoms = [];
        this.result = null;
    }
}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css'],
})
export class SignupComponent {

    constructor(
        private router: Router,
        private userService: UserService,
        private cdr: ChangeDetectorRef   // ✅ ADD THIS
    ) { }

    // ================= USER DATA =================
    user: any = {
        fullName: '',   // ✅ FIXED
        mobile: '',
        email: '',
        password: '',
        gender: '',
        birthdate: '',
        age: '',
        height: '',
        weight: '',
        bloodGroup: '',
        address: '',
    };

    bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    // ================= 🔥 OTP VARIABLES (ADD HERE) =================
    otpSent: boolean = false;
    otp: string = '';

    registerError: string = '';

    isSendingOtp = false;
    isVerifyingOtp = false;

    // 🔥 TIMERS
    resendCooldown = 0; // 30s
    otpExpiryTime = 300; // 5 min (300 sec)

    private resendInterval: any;
    private expiryInterval: any;

    emailStatus: string = '';
    emailError: string = '';

    otpSuccess: string = '';
    otpError: string = '';

    isEmailVerified: boolean = false;

    // ================= AGE CALC =================
    calculateAge() {
        if (this.user.birthdate) {
            const birthDate = new Date(this.user.birthdate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            this.user.age = age;
        }
    }

    // ================= 🔥 SEND OTP =================
    sendOtp() {

        if (!this.user.email) {
            this.emailError = "Enter email first ❌";
            return;
        }

        if (this.isSendingOtp) return;

        this.isSendingOtp = true;

        this.userService.sendOtp(this.user.email.trim().toLowerCase()).subscribe({
            next: () => {

                this.otpSent = true;

                // ✅ BOTH START HERE
                this.startResendTimer();
                this.startExpiryTimer();

                this.cdr.detectChanges();
            },
            error: () => {
                this.emailError = "Failed to send OTP ❌";
            },
            complete: () => {
                this.isSendingOtp = false;
            }
        });
    }

    // ================= 🔥 RESEND TIMER (30s) =================
    startResendTimer() {

        clearInterval(this.resendInterval);

        this.resendCooldown = 300; // ✅ 5 minutes

        this.resendInterval = setInterval(() => {

            if (this.resendCooldown > 0) {
                this.resendCooldown--;
            } else {
                clearInterval(this.resendInterval);
                this.resendInterval = null;
            }

            this.cdr.detectChanges(); // 🔥 important

        }, 1000);
    }
    resendOtp() {

        if (this.resendCooldown > 0) return;

        this.sendOtp(); // reuse same logic
    }
    // ================= 🔥 OTP EXPIRY TIMER (5 min) =================
    startExpiryTimer() {

        clearInterval(this.expiryInterval);

        this.otpExpiryTime = 300; // ✅ 5 min

        this.expiryInterval = setInterval(() => {

            if (this.otpExpiryTime > 0) {
                this.otpExpiryTime--;
            } else {

                clearInterval(this.expiryInterval);

                this.otpError = "OTP expired ❌";
                this.isEmailVerified = false;
                this.otpSent = false;

            }

            this.cdr.detectChanges();

        }, 1000);
    }

    // ================= FORMAT TIMER =================
    formatTime(seconds: number): string {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // ================= 🔥 VERIFY OTP =================
    verifyOtp() {

        if (!this.otp || this.otp.length < 4) {
            this.otpError = "Enter valid OTP ❌";
            return;
        }

        this.isVerifyingOtp = true;
        this.otpError = '';
        this.otpSuccess = '';

        const payload = {
            email: this.user.email.trim().toLowerCase(),
            otp: this.otp.trim()
        };

        this.userService.verifyOtp(payload).subscribe({
            next: () => {

                // ✅ STEP 1: SET VERIFIED
                this.isEmailVerified = true;

                // ✅ STEP 2: HIDE OTP IMMEDIATELY
                this.otpSent = false;
                this.otp = '';

                // ✅ STEP 3: SHOW SUCCESS
                this.otpSuccess = "Email verified successfully ✅";

                this.isVerifyingOtp = false;

                // ✅ FORCE UI UPDATE (VERY IMPORTANT)
                this.cdr.detectChanges();
            },

            error: () => {
                this.otpError = "Invalid OTP ❌";
                this.isVerifyingOtp = false;
                this.cdr.detectChanges();
            }
        });
    }
    limitMobile(event: any) {
        let value = event.target.value;

        // remove non digits
        value = value.replace(/[^0-9]/g, '');

        // limit 10 digits
        value = value.slice(0, 10);

        this.user.mobile = value;
    }
    validateBirthdate() {
        if (!this.user.birthdate) return;

        const birthDate = new Date(this.user.birthdate);
        const today = new Date();

        // ❌ Future date check
        if (birthDate > today) {
            this.registerError = "❌ Birthdate cannot be in the future";
            this.user.birthdate = '';
            this.user.age = '';
            return;
        }

        // ✅ Calculate exact age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        this.user.age = age;

        // ❌ Age < 5 not allowed
        if (age < 5) {
            this.registerError = "❌ Minimum age must be 5 years";
            this.user.birthdate = '';
            this.user.age = '';
            return;
        }

        this.registerError = '';
    }

    // ================= REGISTER =================
    register() {

        this.registerError = ''; // reset

        // ❌ EMAIL NOT VERIFIED
        if (!this.isEmailVerified) {
            this.registerError = "❌ Please verify your email before creating account";
            return;
            this.cdr.detectChanges();
        }

        if (!/^[A-Za-z ]{2,50}$/.test(this.user.fullName)) {
            this.registerError = "❌ Name should contain only letters (no numbers or special characters)";
            return;
        }

        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(this.user.password)) {
            this.registerError = "❌ Password must contain uppercase, lowercase, number and min 6 characters";
            return;
        }

        if (this.user.height && (this.user.height < 50 || this.user.height > 250)) {
            this.registerError = "❌ Enter valid height (50–250 cm)";
            return;
        }

        if (this.user.weight && (this.user.weight < 10 || this.user.weight > 300)) {
            this.registerError = "❌ Enter valid weight";
            return;
        }

        // ❌ MOBILE INVALID
        if (!/^[6-9][0-9]{9}$/.test(this.user.mobile)) {
            this.registerError = "❌ Enter valid Indian mobile number";
            return;
            this.cdr.detectChanges();
        }

        // ❌ EMPTY REQUIRED FIELDS
        if (!this.user.fullName || !this.user.email || !this.user.password) {
            this.registerError = "❌ Please fill all required fields";
            return;
            this.cdr.detectChanges();
        }

        // ✅ API CALL
        this.userService.registerUser(this.user).subscribe({
            next: (response: any) => {
                if (response.success) {
                    alert('✅ Registration Successful!');
                    this.router.navigate(['/login']);
                } else {
                    this.registerError = response.message || '❌ Registration Failed!';
                }
            },
            error: (error) => {
                this.registerError = error.error?.message || '❌ Server Error!';
            }
        });
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
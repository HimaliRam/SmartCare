import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, ViewChild } from '@angular/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    @ViewChild('loginForm') loginForm!: NgForm;

    constructor(
        private router: Router,
        private userService: UserService,
        private http: HttpClient,
        private cd: ChangeDetectorRef
    ) { }

    // ======================
    // LOGIN VARIABLES
    // ======================
    email: string = '';
    password: string = '';
    errorMessage: string = '';
    isLoading: boolean = false;
    loginSuccessMessage: string = ''; // for inline success message

    // ======================
    // FORGOT PASSWORD VARIABLES
    // ======================
    showForgotModal: boolean = false;
    forgotEmail: string = '';
    otp: string = '';
    newPassword: string = '';
    generatedOtp: string = '';
    otpSent: boolean = false;
    passwordReset: boolean = false;
    otpError: string = '';

    // ======================
    // LOGIN FUNCTION
    // ======================
    login() {
        this.errorMessage = '';
        this.loginSuccessMessage = '';

        if (!this.email || !this.password) {
            this.errorMessage = "Email and Password are required";
            return;
        }

        const data = {
            email: this.email.trim(),
            password: this.password
        };

        this.isLoading = true;

        this.userService.login(data).subscribe({
            next: (res: any) => {
                this.isLoading = false;

                console.log("Login response:", res);

                // ✅ CHECK RESPONSE
                if (res && res.userId) {

                    console.log("✅ Login success");

                    // ✅ MUST ADD TOKEN
                    localStorage.setItem('token', 'logged-in');

                    // ✅ store clean user object
                    localStorage.setItem('user', JSON.stringify({
                        id: res.userId,
                        fullName: res.fullName,
                        email: res.email
                    }));

                    this.router.navigate(['/home']);
                }
                else {
                    this.errorMessage = "Invalid credentials";
                }
            },

            error: (err: any) => {
                this.isLoading = false;

                console.log("LOGIN ERROR:", err);

                let message = "";

                if (err.status === 401 || err.status === 400) {
                    message = "Invalid email or password ❌";
                } else if (err.status === 0) {
                    message = "Server not reachable ❌";
                } else {
                    message = "Something went wrong ❌";
                }

                this.errorMessage = message;

                alert(message);
                this.cd.detectChanges();
            }
        });
    }
    clearError() {
        this.errorMessage = '';
        this.loginSuccessMessage = '';
    }

    goToSignup() {
        this.router.navigate(['/signup']);
    }

    // ======================
    // FORGOT PASSWORD LOGIC
    // ======================
    openForgotModal() {
        this.showForgotModal = true;
        this.otpSent = false;
        this.passwordReset = false;
        this.otpError = '';
        this.otp = '';
        this.newPassword = '';
    }

    closeForgotModal() {
        this.showForgotModal = false;
        this.resetForgotState();
    }

    resetForgotState() {
        this.forgotEmail = '';
        this.otp = '';
        this.newPassword = '';
        this.generatedOtp = '';
        this.otpSent = false;
        this.passwordReset = false;
        this.otpError = '';
    }

    clearForgotError() {
        this.otpError = '';
    }

    // STEP 1: SEND OTP
    sendOtp() {
        const email = this.forgotEmail.trim().toLowerCase();

        this.http.post('http://localhost:5116/api/auth/send-otp', { email })
            .subscribe({
                next: (res: any) => {
                    alert("OTP sent to your email");
                    this.otpSent = true;
                    this.cd.detectChanges();
                },
                error: () => {
                    alert("Invalid Email");
                    this.cd.detectChanges();
                }
            });
    }
    // STEP 2: VERIFY OTP
    verifyOtp() {
        this.http.post('http://localhost:5116/api/auth/verify-otp', {
            email: this.forgotEmail.trim().toLowerCase(), otp: this.otp
        })
            .subscribe({
                next: (res: any) => {
                    console.log(res);
                    this.passwordReset = true;
                    this.otpError = '';
                    this.cd.detectChanges();
                },
                error: () => {
                    this.otpError = "Invalid OTP";
                    this.cd.detectChanges();
                }
            });
    }

    // STEP 3: RESET PASSWORD
    resetPassword() {

        if (!this.newPassword || this.newPassword.length < 4) {
            alert("Enter valid password (min 4 chars)");
            return;
        }

        const payload = {
            email: this.forgotEmail.trim().toLowerCase(), // 🔥 FIX
            newPassword: this.newPassword
        };

        console.log("RESET PAYLOAD:", payload); // DEBUG

        this.http.post('http://localhost:5116/api/auth/reset-password', payload)
            .subscribe({
                next: (res: any) => {

                    console.log("RESET SUCCESS:", res);

                    alert("Password reset successfully! ✅");

                    // Auto fill login email
                    this.email = this.forgotEmail;

                    this.showForgotModal = false;
                    this.resetForgotState();

                    setTimeout(() => {
                        if (this.loginForm) {
                            this.loginForm.resetForm({
                                email: this.email,
                                password: ''
                            });
                        }
                    }, 50);
                },
                error: (err) => {

                    console.error("RESET ERROR:", err);

                    alert(err.error?.message || "Reset failed ❌");
                }
            });
    }
    getUser() {
        const user = localStorage.getItem('user');
        return user && user !== 'undefined' ? JSON.parse(user) : {};
    }
}
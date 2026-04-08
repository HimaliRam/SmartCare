import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { filter } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/model.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        NavbarComponent,
        FormsModule,
        HttpClientModule
    ],
    templateUrl: './app.component.html'
})
export class AppComponent {

    showNavbar = true;
    showToast = false;
    toastMessage = '';
    toastType = '';
    showModal = false;
    editUser: any = {};

    constructor(
        private router: Router,
        private modalService: ModalService,
        private cd: ChangeDetectorRef,
        private auth: AuthService
    ) {

        // 🔥 ROUTE HANDLING
        this.router.events
            .pipe(filter((event: any) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
                const hiddenRoutes = ['/login', '/signup'];
                this.showNavbar = !hiddenRoutes.includes(event.urlAfterRedirects);
            });

        // 🔥 MODAL LISTENER (MAIN LOGIC)
        this.modalService.modal$.subscribe(user => {
            this.showModal = false; // ✅ reset first
            if (user) {
                console.log("MODAL RECEIVED ✅");

                this.editUser = { ...user };


                this.showModal = true;

                this.cd.detectChanges(); // 🔥 IMPORTANT
            } else {
                this.showModal = false;
            }
        });
    }

    // ✅ CLOSE MODAL
    closeModal() {
        this.modalService.close();
    }

    // ✅ UPDATE PROFILE
    updateProfile() {

        const payload = {
            id: Number(this.editUser.id),
            fullName: this.editUser.fullName,
            email: this.editUser.email,
            mobile: this.editUser.mobile,
            age: Number(this.editUser.age),
            height: Number(this.editUser.height),
            weight: Number(this.editUser.weight),
            bloodGroup: this.editUser.bloodGroup
        };

        this.auth.updateProfile(payload).subscribe({
            next: (res: any) => {

                localStorage.setItem('user', JSON.stringify(res));

                this.modalService.close();

                // ✅ IMPORTANT: FORCE REFRESH HEALTH PAGE
                window.location.reload();

                this.showNotification("Profile updated successfully ✅", "success");
            },
            error: (err) => {
                this.showNotification("Update failed ❌", "error");
            }
        });
    }
    showNotification(message: string, type: 'success' | 'error' = 'success') {
        this.toastMessage = message;
        this.toastType = type;
        this.showToast = true;

        this.cd.detectChanges(); // 🔥 IMPORTANT

        setTimeout(() => {
            this.showToast = false;
            this.cd.detectChanges(); // 🔥 ensure hide works
        }, 3000);
    }
}



import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { ModalService } from '../../services/model.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {

  isScrolled = false;
  menuOpen = false;
  dropdownOpen = false;
  isOpening = false; // 🔥 ADD THIS
  showDeleteModal = false;


  user: any = {};

  constructor(
    private translate: TranslateService,
    private modalService: ModalService,
    private auth: AuthService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.loadUser();

    // ✅ ADD THIS (VERY IMPORTANT)
    window.addEventListener('storage', () => {
      this.loadUser();
    });
  }

  // ✅ LOAD USER SAFELY
  loadUser() {
    const user = this.auth.getUser();

    console.log("NAV USER:", user);

    if (user && (user.id || user.userId)) {

      // ✅ normalize
      this.user = {
        id: user.id || user.userId,
        fullName: user.fullName,
        email: user.email
      };

      this.cd.detectChanges();
    }
  }
  get userInitial(): string {
    return this.user?.fullName
      ? this.user.fullName.charAt(0).toUpperCase()
      : 'U';
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // ✅ FIXED HERE (IMPORTANT)
  openUpdateProfile() {

    if (this.isOpening) return;

    this.isOpening = true;

    this.dropdownOpen = false; // 🔥 CLOSE IMMEDIATELY

    const user = this.auth.getUser();
    const userId = user?.id || user?.userId;

    if (!userId) {
      this.isOpening = false;
      return;
    }

    this.auth.getUserById(userId).subscribe({
      next: (fullUser: any) => {

        this.modalService.open({
          id: fullUser.id,
          fullName: fullUser.fullName,
          email: fullUser.email,
          mobile: fullUser.mobile,
          age: fullUser.age,
          height: fullUser.height,
          weight: fullUser.weight,
          bloodGroup: fullUser.bloodGroup
        });

        this.isOpening = false;
      },
      error: () => {
        this.isOpening = false;
      }
    });
  }
  // ✅ FIXED HERE ALSO
  deleteAccount() {
    this.showDeleteModal = true; // open custom modal
  }

  confirmDelete() {
    const user = this.auth.getUser();
    const userId = user?.id || user?.userId;

    if (!userId) return;

    this.auth.deleteAccount(userId).subscribe({
      next: () => {
        this.showDeleteModal = false;

        this.auth.logout();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.showDeleteModal = false;
        alert("Delete failed ❌");
      }
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
  }

  scrollTo(id: string) {
    if (this.router.url !== '/home') {
      this.router.navigate(['/home']).then(() => {
        setTimeout(() => {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }

    this.menuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }
}




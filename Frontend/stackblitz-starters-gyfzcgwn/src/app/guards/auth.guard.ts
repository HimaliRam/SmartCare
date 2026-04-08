import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
    const router = inject(Router);
    const auth = inject(AuthService);

    if (auth.isLoggedIn()) {
        console.log("? Guard Passed");
        return true;
    } else {
        console.log("? Guard Blocked");
        return router.createUrlTree(['/login']);
    }
};





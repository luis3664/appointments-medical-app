import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const firebaseUser = await firstValueFrom(authService.user$);

    if (!firebaseUser) {
        router.navigate(['/index']);
        return false;
    }

    const userData = await authService.getCurrentUserData();

    if (userData?.role === 'admin') return true;

    // 🔥 esto evita acceso no autorizado
    router.navigate(['/user']);
    return false;
};
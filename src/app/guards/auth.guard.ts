import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const AuthGuard: CanActivateFn = async () => {

    const authService = inject(AuthService);
    const router = inject(Router);

    const user = await firstValueFrom(authService.user$);

    if (user) return true;

    alert('Debes iniciar sesión para reservar un turno');

    router.navigate(['/index']);
    return false;
};
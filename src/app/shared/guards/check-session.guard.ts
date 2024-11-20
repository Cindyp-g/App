import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../../pages/auth/services/auth.service';
import { inject } from '@angular/core';

export const checkSessionGuard: CanActivateFn = (route, state) => {
  const authSvc = inject(AuthService);

return authSvc.token$.pipe(
  take(1),
  map(token => {if (token) return true;

    inject(Router).createUrlTree(['/login']);
    return false;
  })

)
};

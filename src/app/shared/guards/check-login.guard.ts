import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../../pages/auth/services/auth.service';
import { map, take } from 'rxjs';

export const checkLoginGuard: CanActivateFn = (route, state) => {
const authSvc = inject(AuthService);

return authSvc.token$.pipe(
  take(1),
  map(token => !token ? true : false)

)
};

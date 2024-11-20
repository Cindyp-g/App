import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../pages/auth/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Entra");
  if(req.headers.get('requireToken')){
    const authSvc = inject(AuthService);
    const token = authSvc.tokenValue;

    if(token){
      const authReq = req.clone({
        setHeaders: {
          Authorization : `Bearer ${token}`
        }
      });
      return next(authReq);
    }

  }
  return next(req);
};

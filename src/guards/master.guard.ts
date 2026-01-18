
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const masterGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  if (auth.isMaster()) {
    return true;
  }

  toast.show("ACESSO NEGADO: Requer God Mode.", "error");
  return router.parseUrl('/home');
};

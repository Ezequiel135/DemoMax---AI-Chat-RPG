
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

export const nonGuestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const permissions = inject(PermissionService);

  if (auth.isGuest()) {
    // Apenas tenta performar uma ação restrita para disparar o modal do serviço
    // Isso mantém o usuário na página atual mas abre o popup "Conta Necessária"
    permissions.canPerform('create_character'); 
    return false;
  }
  
  return true;
};

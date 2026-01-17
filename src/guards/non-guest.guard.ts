
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { AuthService } from '../services/auth.service';

export const nonGuestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const permissions = inject(PermissionService);

  if (auth.isGuest()) {
    // Trigger the modal logic implicitly by checking a restricted action
    permissions.canPerform('create_character'); 
    return false;
  }
  
  return true;
};

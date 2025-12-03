import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLES_KEY } from './decorator/auth.decorator'
import { Role } from './enum/auth.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) return true
    const request = context.switchToHttp().getRequest()
    const user = request.user
    if (!user) return false
    return requiredRoles.some((role) =>
      Array.isArray(user.role) ? user.role.includes(role) : user.role === role,
    )
  }
}

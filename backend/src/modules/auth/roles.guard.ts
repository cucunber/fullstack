import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';

const DEFAULT_TOKEN_TYPE = 'Bearer';

@Injectable()
export class RoleGuards implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );
      if (!requiredRoles) {
        return true;
      }

      const authHeader = request.headers.authorization;
      const [tokenType, token] = authHeader.split(' ');
      if (tokenType !== DEFAULT_TOKEN_TYPE || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized user' });
      }
      const user = this.jwtService.verify(token);
      request.user = user;
      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (error) {
      throw new HttpException('invalid', HttpStatus.FORBIDDEN);
    }
  }
}

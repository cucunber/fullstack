import { ExecutionContext } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

const DEFAULT_TOKEN_TYPE = 'Bearer';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const authHeader = request.headers.authorization;
      const [tokenType, token] = authHeader.split(' ');
      if (tokenType !== DEFAULT_TOKEN_TYPE || !token) {
        throw new UnauthorizedException({ message: 'Unauthorized user' });
      }
      const user = this.jwtService.verify(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Unauthorized user' });
    }
  }
}

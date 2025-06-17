import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request) || request.cookies[process.env.COOKIE_KEY];
    
    if (!token)  throw new UnauthorizedException();
    
    try {
      const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET});
      request['id'] = payload.id;
      request['email'] = payload.email;
      request['role'] = payload.role;
      request['shopId'] = payload?.shopId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization;
    if (token) {
      return token.split(' ').pop();
    } else {
      return undefined;
    }
  }
}

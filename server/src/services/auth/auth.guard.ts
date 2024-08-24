import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthService } from './service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private service: AuthService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: process.env.JWT_SECRET
        }
      );

      const userExists = await this.service.findById(payload.id);

      if (!userExists) {
        throw new UnauthorizedException();
      }

      request['id'] = payload.id;
      request['email'] = payload.email;
      request['role'] = userExists.role;
      request['shopId'] = payload?.shopId;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.headers.authorization;
    if (token) {
      return token;
    } else {
      return undefined;
    }
  }
}
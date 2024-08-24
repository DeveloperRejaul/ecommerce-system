import { Controller } from '@nestjs/common';
import { AuthService } from './service';

@Controller('api/v-1/auth')
export class AuthController {
    constructor(private readonly service: AuthService) { }
}

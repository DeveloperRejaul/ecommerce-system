import { Controller, Get, Res} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

@Controller('/')
export class AppController {
    @Get()
    root(@Res() res : Response) {
       return res.sendFile(join(process.cwd(), 'client', 'app.html'));
    }
    @Get('dashboard')
    dashboard(@Res() res : Response) {
       return res.sendFile(join(process.cwd(), 'client', 'index.html'));
    }
}

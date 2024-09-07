import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

@Controller('/')
export class AppController {
  @Get()
  getHello(@Res() res): string {
    const file = join(process.cwd(), 'dist', 'client', 'index.html');
    
    if (existsSync(file)) {
      return res.sendFile(file);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }
}

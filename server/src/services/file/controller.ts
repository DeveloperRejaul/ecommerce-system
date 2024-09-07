import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('api/v-1/file')
export class FileController {
  @Get(':id')
  getFile(@Param()param, @Res() res) {
    const file = join(process.cwd(), 'dist', 'upload', param.id);
    
    if (existsSync(file)) {
      return res.sendFile(file);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }
}

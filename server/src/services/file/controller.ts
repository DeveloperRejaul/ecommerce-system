
import { Controller, Get, HttpStatus, Param, Post, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { uploadToCloudinary } from 'src/utils/file';
import { IFileType } from 'src/types';

@Controller('api/v-1')
export class FileController {
  @Get('file/:id')
  getFile(@Param()param, @Res() res) {  
    const file = join(process.cwd(), 'upload', param.id);
    if (existsSync(file)) {
      return res.sendFile(file);
    } else {
      return res.status(HttpStatus.NOT_FOUND).send('File not found');
    }
  }

  @Post('file')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {limits: {fileSize: 500 * 1024}}))
  async upload(@UploadedFile() file:IFileType ) {
   const url = await uploadToCloudinary(file);
   return {url};
  }

  
  @Post('files')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10, {limits:{fileSize: 500 * 1024}}))
  async uploads(@UploadedFiles() files:IFileType[]) {
   const urls = await Promise.all(files.map(async (file) => await uploadToCloudinary(file)));
   return {urls};
  }
}

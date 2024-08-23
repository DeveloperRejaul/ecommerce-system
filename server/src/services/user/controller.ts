import { UserService } from './service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { JoiValidationPipe } from '../../validation.pipe';
import { createUserSchema, updateUserSchema } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/v-1/user')
export class UserController {
  constructor(private readonly service: UserService) {}




  @Post('signup')
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @UseInterceptors(FileInterceptor('avatar'))
  async createUser(@Body() user, @UploadedFile() file) {
    return this.service.create(user, file);
  }

  @Post('vip')
  @UseGuards(AuthGuard)
  @UsePipes(new JoiValidationPipe(createUserSchema))
  @UseInterceptors(FileInterceptor('avatar'))
  async createVip(@Request() req, @Body() body, @UploadedFile() file) {
    return await this.service.Vip(body, file, {
      id: req.id,
      email: req.email,
      role: req.role,
    });
  }

  @Post('login')
  async loginUser(@Body() body) {
    return this.service.login(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Request() {role, shopId}) {
    return this.service.getAll(role, shopId);
  }

  @Get(':id')
  getUser(@Param() { id }) { 
    return this.service.findById(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('avatar'))
  @UsePipes(new JoiValidationPipe(updateUserSchema))
  @UseGuards(AuthGuard)
  update(@Param() { id }, @Body() body, @UploadedFile() file) { 
    return this.service.update(id, body, file);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param() { id }) { 
    return this.service.delete(id);
  }

}

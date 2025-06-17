import { UserService } from './service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { CheckEmailDto, CheckOtpDto, CreateUserDto, LoginUserDto, ResetPasswordDto, UpdateUserDto } from './dto';

@Controller('api/v-1/user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post('reset-password')
  async resetPassword(@Body() body:ResetPasswordDto) {
    return this.service.resetPassword(body);
  }

  @Post('check-email')
  async checkEmailExists(@Body() body:CheckEmailDto) {
    return this.service.checkMailExists(body.email);
  }

  @Post('check-otp')
  async checkOtp(@Body() body:CheckOtpDto) {
    return this.service.checkOtp(body);
  }

  @Post('signup')
  async createUser(@Body() user:CreateUserDto) {
    return this.service.create(user);
  }

  @Post('vip')
  @UseGuards(AuthGuard)
  async createVip(@Req() req, @Body() body:CreateUserDto) {
  // async createVip(@Req() req, @Body() body) {
    return await this.service.Vip(body, {id: req.id, email: req.email, role: req.role});
  }

  @Post('login/dashboard')
  async dashboardLogin(@Body() body:LoginUserDto, @Res({ passthrough: true }) res) {
    return this.service.dashboardLogin(body, res);
  }

  @Post('login/client')
  async clientLogin(@Body() body:LoginUserDto, @Res({ passthrough: true }) res) {
    return this.service.clientLogin(body, res);
  }

 @Post('logout')
  async logoutUser(@Res({ passthrough: true }) res) {
    return this.service.logout(res);
  }

  @Get('check')
  async checkUser(@Req() request) {
    return this.service.checkValidUser(request);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Req() req, @Query() params) {
    return this.service.getAll(req, params);
  }

  @Get(':id')
  getUser(@Param() { id }) {
    return this.service.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update( @Param() param, @Body() body:UpdateUserDto, @Req() { role, email, id, shopId }) {
    return this.service.update(param.id, body, {role, email,id,shopId});
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param() param, @Req() { role, email, id, shopId }) {
    return this.service.delete(param.id, { role, email, id, shopId });
  }
}

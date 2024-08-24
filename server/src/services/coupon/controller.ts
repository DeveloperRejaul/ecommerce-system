import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { CouponService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCouponDto, UpdateCouponDto } from './dto';


@Controller('api/v-1/coupon')
export class CouponController {
  constructor(private readonly service: CouponService) { }

  @Post()
  @UseGuards(AuthGuard)
  createCoupon(@Body() body: CreateCouponDto, @Request() req) {
    return this.service.createCoupon(body, req);
  }


  @Get()
  @UseGuards(AuthGuard)
  getCoupon(@Request() req) {
    return this.service.getCoupon(req);
  }


  @Get(':id')
  getByIdCoupon(@Param() param) {
    return this.service.getByIdCoupon(param.id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateCoupon(@Param() param, @Body() body: UpdateCouponDto, @Request() req) {
    return this.service.updateCoupon(param.id, body, req);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteCoupon(@Param() param, @Request() req) {
    return this.service.deleteCoupon(param.id, req);
  }
}

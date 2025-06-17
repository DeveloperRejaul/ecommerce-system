import { ShopService } from './service';
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
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateShopDto, UpdateShopDto } from './dto';


@Controller('api/v-1/shop')
export class ShopController {
  constructor(private readonly service: ShopService) { }


  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body:CreateShopDto, @Req() { id, email, role }) {
    return this.service.create(body, { id, email, role });
  }


  @Get()
  @UseGuards(AuthGuard)
  getAll(@Request() { role }, @Query() query) {
    return this.service.getAll(role, query);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  getCount(@Request() { role }) {
    return this.service.getCount(role);
  }

  @Get(':id')
  getById(@Param() param,) {
    return this.service.getById(param.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Param() param, @Request() { role, shopId }) {
    return this.service.delete(param.id, role, shopId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param() param, @Request() { role, shopId }, @Body() body: UpdateShopDto,) {
    return this.service.update(param.id, role, shopId, body);
  }
}

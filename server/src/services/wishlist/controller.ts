import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateWishlistDto } from './dto';


@Controller('api/v-1/wishlist')
export class WishlistController {
  constructor(private readonly service: WishlistService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() body : CreateWishlistDto) {
   return this.service.create(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll(@Req() req , @Query() query) {
    return this.service.getAll(req, query);
  }

  @Get('product/:id')
  @UseGuards(AuthGuard)
  getByProductId (@Req() req ,@Param() param ) {
    return this.service.getByProductId(req, param);
  }
  
  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Req() auth , @Param() param, @Body() body){
    return this.service.update( auth,param.id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  delete(@Req() auth, @Param() param){
    return this.service.delete(auth, param.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  get(@Req() auth, @Param() param) {
   return this.service.get(auth, param.id);
  }

}

import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { RatingService } from './service';
import { CreateRatingDto, UpdateRatingDto } from './dto';
import { AuthGuard } from '../auth/auth.guard';


@Controller('api/v-1/rating')
export class RatingController {
  constructor(private readonly service: RatingService) { }

  @Post()
  @UseGuards(AuthGuard)
  creatingRating(@Body() body: CreateRatingDto, @Request() req) {
    return this.service.creatingRating(body, req);
  };

  @Get()
  @UseGuards(AuthGuard)
  getAllRating(@Request() req) {
    return this.service.getAllRating(req);
  };

  @Put(':id')
  @UseGuards(AuthGuard)
  updateRating(@Param() param, @Request() req, @Body() body: UpdateRatingDto) {
    return this.service.updateRating(param.id, req, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteRating(@Param() param, @Request() req) {
    return this.service.deleteRating(param.id, req);
  };
}

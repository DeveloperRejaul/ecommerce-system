import { Controller } from '@nestjs/common';
import { RatingService } from './service';


@Controller('api/v-1/rating')
export class RatingController {
  constructor(private readonly service: RatingService) { }
  creatingRating() {
    return this.service.creatingRating();
  };


  deleteRating() {
    return this.service.deleteRating();
  };


  getAllRating() {
    return this.service.getAllRating();
  };


  updateRating() {
    return this.service.updateRating();
  }


}

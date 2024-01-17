import { Router } from 'express';
import { creatingRating, getAllRating, updateRating } from './rating.fn';
import { auth } from '../../middleware/auth';

const router = Router();

export default (params) => {
  // create rating
  router.post('/rating', auth, creatingRating(params));

  // get all rating access only ADMIN , SUPER_ADMIN , MODERATOR
  router.get('/rating', auth, getAllRating(params));

  // Update  rating access only ADMIN , SUPER_ADMIN , MODERATOR
  router.put('/rating/:id', auth, updateRating(params));

  // delete  rating access only ADMIN , SUPER_ADMIN , MODERATOR
  router.delete('/rating/:id', () => {});

  return router;
};

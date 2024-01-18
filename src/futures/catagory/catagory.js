import { Router } from 'express';
import { createCatagory, deleteCatagory, getCatagory, updateCatagory } from './catagory.fn';
import { auth } from '../../middleware/auth';

const router = Router();

export default (params) => {
  router.post('/catagory', auth, createCatagory(params));
  router.get('/catagory', auth, getCatagory(params));
  router.put('/catagory/:id', auth, updateCatagory(params));
  router.delete('/catagory/:id', auth, deleteCatagory(params));

  return router;
};

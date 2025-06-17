/* eslint-disable import/prefer-default-export */
import { z } from 'zod';

export default z.object({
  email: z.string().email({ message: 'Email validation failed' }),
  name: z.string({ message: 'type valid name' }).min(5).max(20),
  address: z.string({ message: 'type valid name' }),
  userId: z.string({ message: 'Select user' }),
  expireDate: z.date({ message: 'Please select expire date' }),
  price: z.string({ message: 'Please type price' }),
});

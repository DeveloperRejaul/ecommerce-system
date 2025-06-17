import { z } from 'zod';

export default z.object({
  email: z.string().email({ message: 'Email validation failed' }),
  name: z.string({ message: 'Type valid name' }).min(5).max(20),
  role: z.string({ message: 'Select valid role' }),
  shopId: z.string({ message: 'Select valid shop name' }).optional(),
  password: z.string({ message: 'Type valid password' }).min(6, { message: 'Min length 6' }).max(20, { message: 'Max length 20' }).or(z.null()),
  address: z.string({ message: 'Type valid address' }),
});

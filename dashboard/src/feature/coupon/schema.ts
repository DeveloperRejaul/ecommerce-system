import { z } from 'zod';

export default z.object({
  type: z.enum(['FIX', 'PERCENT']),
  name: z.string({ message: 'Name is required' }).min(5).max(100),
  value: z.string({ message: 'Value is required' }),
  quantity: z.string({ message: 'Quantity is required' }),
  shopId: z.string({ message: 'Shop is required' }).optional(),
});

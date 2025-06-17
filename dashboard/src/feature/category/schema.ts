/* eslint-disable import/prefer-default-export */
import { z } from 'zod';

export const formSchema = z.object({
  name: z.string({ message: 'Type valid name' }).min(5).max(20),
  type: z.enum(['ROUNDED', 'SQUARE', 'TOP_SELECTION', 'HIDE'], { message: 'Select category type' }),
  discount: z.string({ message: 'Type number of discount' }).min(0, { message: 'Min discount 0' }).max(100, { message: 'Max discount 100' }).optional(),
});

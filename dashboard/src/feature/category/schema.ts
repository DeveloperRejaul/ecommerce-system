import { z } from 'zod';

export const formSchema = z.object({
    name: z.string({ message: 'type valid name' }).min(5).max(20),
    shop: z.string({ message: 'Type valid shop name' }),
});
import { z } from 'zod';

export const formSchema = z.object({
    email: z.string().email({ message: 'Email validation failed' }),
    name: z.string({ message: 'type valid name'}).min(5).max(20),
    address: z.string({ message: 'type valid name'})
});
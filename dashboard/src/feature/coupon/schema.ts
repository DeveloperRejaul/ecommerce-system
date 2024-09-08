import { z } from 'zod';

export const formSchema = z.object({
    type: z.string(),
    name: z.string({ message: "Name is required" }),
    time: z.number(),
    value: z.number(),
    quantity: z.number(),
    shopId: z.string()
});

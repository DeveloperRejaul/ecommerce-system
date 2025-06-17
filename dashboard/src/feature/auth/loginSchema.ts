import { z } from 'zod';

export const formSchema = z.object({
  email: z.string().email({ message: 'Email validation failed' }),
  password: z.string()
    .min(6, { message: 'Password at lase 6 chart ' })
    .max(20, { message: 'Mex length 20' }),
});

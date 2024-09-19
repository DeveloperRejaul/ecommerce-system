import { z } from 'zod';

export const formSchema = z.object({
    name: z.string().min(5, { message: "Name must more than 5 chart" }).max(20, { message: "Name max length 20" }),
    title: z.string().min(10, { message: "Title must 10 chart" }).max(100, { message: "Title max length 100" }),
    description: z.string().min(50, { message: "Title must 50 chart" }).max(10000, { message: "Title max length 10000" }),
    category: z.string({ message: "Category must require " }),
    buyPrice: z.string(),
    shopId: z.string().optional(),
    couponId: z.string().optional(),
    brandId: z.string({ message: "Brand must require " }),
    sellPrice: z.string({ message: "sellPrice must require " }),
    quantity: z.string()
});
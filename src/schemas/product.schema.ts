import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long" }).optional(),
    price: z.number().min(0.01, { message: "Price must be greater than 0" }),
    category: z.enum(["Hamburguesas", "Bebidas", "Acompañamientos"], { message: "Invalid category" }),
});

export const productUpdateSchema = productSchema.partial();

import { z } from "zod";

export const userSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email format" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    role: z.enum(["admin", "customer", "dealer"], { message: "Invalid role" }),
});

export const userUpdateSchema = userSchema.partial();

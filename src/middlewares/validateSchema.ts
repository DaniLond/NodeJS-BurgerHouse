import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";

export const validateSchema = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction): void => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                errors: error.errors.map((err) => ({
                    field: err.path.join("."),
                    message: err.message,
                })),
            });
            return;
        }
        res.status(500).json({ message: "Validation error" });
        return;
    }
};

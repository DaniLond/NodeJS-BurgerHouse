import { Router } from "express";
import { productController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";
import { validateSchema } from '../middlewares/validateSchema';
import { productSchema, productUpdateSchema } from '../schemas/product.schema';

export const productRouter = Router();

const adminAuth = [auth, authorizeRoles(['admin'])];


productRouter.get("/", productController.findAll);
productRouter.post("/create", adminAuth, validateSchema(productSchema), productController.create);
productRouter.put("/update/:name", adminAuth, validateSchema(productUpdateSchema), productController.update);
productRouter.delete("/delete/:name", adminAuth, productController.delete);
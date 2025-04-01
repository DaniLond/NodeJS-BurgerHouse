import { Router } from "express";
import { productController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const productRouter = Router();

const adminAuth = [auth, authorizeRoles(['admin'])];


productRouter.get("/", productController.findAll);
productRouter.post("/create", adminAuth, productController.create);
productRouter.put("/update/:name", adminAuth, productController.update);
productRouter.delete("/delete/:name", adminAuth, productController.delete);
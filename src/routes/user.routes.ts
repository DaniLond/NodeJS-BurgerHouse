import { Router } from "express";
import { userController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";
import { userSchema, userUpdateSchema } from "../schemas/user.schema";
import { validateSchema } from "../middlewares/validateSchema";

export const userRouter = Router();

const adminAuth = [auth, authorizeRoles(['admin'])];

userRouter.get("/", adminAuth, userController.findAll);
userRouter.post("/create", validateSchema(userSchema), userController.create);
userRouter.post("/login", userController.login);
userRouter.put("/update/:email", adminAuth, validateSchema(userUpdateSchema), userController.update);
userRouter.delete("/delete/:email", adminAuth, userController.delete);
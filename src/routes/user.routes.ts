import { Router } from "express";
import { userController } from "../controllers";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";

export const userRouter = Router();

const adminAuth = [auth, authorizeRoles(['admin'])];

userRouter.get("/", adminAuth, userController.findAll);
userRouter.post("/create", userController.create);
userRouter.post("/login", userController.login);
userRouter.put("/update/:email", adminAuth, userController.update);
userRouter.delete("/delete/:email", adminAuth, userController.delete);
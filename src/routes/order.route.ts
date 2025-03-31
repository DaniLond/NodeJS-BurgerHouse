import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";


const roleAuth = [auth, authorizeRoles(['admin', 'customer', 'dealer'])];

const roleAuth_D = [auth, authorizeRoles(['admin', 'customer'])];

const router = Router();
router.post("/", orderController.create);
router.get("/", roleAuth, orderController.getAll);
router.get("/:id", orderController.getById);
router.put("/:id", roleAuth, orderController.update);
router.delete("/:id",roleAuth_D, orderController.delete);
router.patch("/status/:id", orderController.updateStatus);

export default router;

import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { auth, authorizeRoles } from "../middlewares/auth.middleware";


const roleAuth = [auth, authorizeRoles(['admin', 'customer', 'dealer'])];

const roleAuth_D = [auth, authorizeRoles(['admin', 'customer'])];

const roleAuthWithD = [auth, authorizeRoles(['admin','dealer' ])];


const router = Router();
router.post("/",roleAuth, orderController.create);
router.get("/", roleAuthWithD, orderController.getAll);
router.get("/:id", roleAuth, orderController.getById);
router.put("/:id", roleAuth_D, orderController.update);
router.delete("/:id",roleAuth_D, orderController.delete);
router.patch("/status/:id",roleAuthWithD, orderController.updateStatus);

export default router;

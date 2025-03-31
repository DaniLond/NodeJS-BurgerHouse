import { Router } from "express";
import { orderController } from "../controllers/order.controller";

const router = Router();
router.post("/", orderController.create);
router.get("/", orderController.getAll);
router.get("/:id", orderController.getById);
router.put("/:id", orderController.update);
router.delete("/:id", orderController.delete);
router.patch("/:id/status", orderController.updateStatus);

export default router;

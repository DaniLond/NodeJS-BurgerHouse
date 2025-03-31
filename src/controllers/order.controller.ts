import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { OrderDocument, OrderInput } from "../models/order.model";

class OrderController {

    async create(req: Request, res: Response) {
        try {
            const newOrder: OrderDocument = await orderService.create(req.body as OrderInput);
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ message: "Error al crear la orden" });
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const orders: OrderDocument[] = await orderService.getAll();
            res.json(orders);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener órdenes" });
        }
    }

   
    async getById(req: Request, res: Response) {
        try {
            const order: OrderDocument | null = await orderService.getById(req.params.id);
            if (!order) {
                 res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json(order);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener la orden" });
            return;
        }

        
    }


    async update(req: Request, res: Response) {
        try {
            const updatedOrder: OrderDocument | null = await orderService.update(req.params.id, req.body as OrderInput);
            if (!updatedOrder) {
                res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar la orden" });
            return; 
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const deletedOrder: OrderDocument | null = await orderService.delete(req.params.id);
            if (!deletedOrder) {
                 res.status(404).json({ message: "Orden no encontrada" });
                 return;
            }
            res.json({ message: "Orden eliminada correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar la orden" });
            return;
        }
    }

    async updateStatus(req: Request, res: Response) {
        try {
            const updatedOrder: OrderDocument | null = await orderService.updateStatus(req.params.id, req.body.state);
            if (!updatedOrder) {
                res.status(404).json({ message: "Orden no encontrada" });
                return;
            }
            res.json(updatedOrder);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el estado de la orden" });
            return;
        }
    }
}

export const orderController = new OrderController();
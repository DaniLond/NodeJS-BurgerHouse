import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { OrderDocument, OrderInput } from "../models/order.model";
import { securityService } from "../services";


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
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }

        const claims = await securityService.getClaims(token);
        const order = await orderService.getById(req.params.id);

        if (!order) {
            res.status(404).json({ message: "Orden no encontrada" });
            return;
        }

        if (claims.role === "customer" && order.user !== claims.email) {
            res.status(403).json({ message: "No puedes actualizar pedidos de otros usuarios" });
            return;
        }

        const updatedOrder: OrderDocument | null = await orderService.update(req.params.id, req.body as OrderInput);
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar la orden" });
    }
}

async delete(req: Request, res: Response) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: "No autorizado" });
            return;
        }

        const claims = await securityService.getClaims(token);
        const order = await orderService.getById(req.params.id);

        if (!order) {
            res.status(404).json({ message: "Orden no encontrada" });
            return;
        }

        if (claims.role === "customer" && order.user !== claims.email) {
            res.status(403).json({ message: "No puedes eliminar pedidos de otros usuarios" });
            return;
        }

        if (claims.role === "customer" && !["En preparación", "Pendiente"].includes(order.state)) {
            res.status(400).json({ message: "Solo puedes eliminar órdenes en estado 'En preparación' o 'Pendiente'" });
            return;
        }

        await orderService.delete(req.params.id);
        res.json({ message: "Orden eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la orden" });
    }
}



   
async updateStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { state } = req.body;

        if (!state) {
             res.status(400).json({ message: "El estado es obligatorio" });
             return;
        }

        const updatedOrder: OrderDocument | null = await orderService.updateStatus(id, state);
        if (!updatedOrder) {
             res.status(404).json({ message: "Orden no encontrada" });
             return;
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error("Error al actualizar estado:", error);
        res.status(500).json({ message: "Error al actualizar el estado de la orden" });
        return;
    }
}
}

export const orderController = new OrderController();
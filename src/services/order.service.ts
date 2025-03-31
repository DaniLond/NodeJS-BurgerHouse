import { Order, OrderDocument, OrderInput } from "../models/order.model";

class OrderService {
    
    async create(data: OrderInput): Promise<OrderDocument> {
        try {
            const order = await Order.create(data);
            return order;
        } catch (error) {
            throw error;
        }
    }

    async getAll(): Promise<OrderDocument[]> {
        try {
            return await Order.find();
        } catch (error) {
            throw error;
        }
    }
    async getById(id: string): Promise<OrderDocument | null> {
        try {
            return await Order.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, data: Partial<OrderInput>): Promise<OrderDocument | null> {
        try {
            return await Order.findByIdAndUpdate(id, data, { returnOriginal: false });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string): Promise<OrderDocument | null> {
        try {
            return await Order.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
 async updateStatus(id: string, state: string): Promise<OrderDocument | null> {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { state },
            { new: true, runValidators: true }
        );
        return updatedOrder;
    } catch (error) {
        console.error("Error en updateStatus:", error);
        throw error;
    }
}


    async getByUserEmail(email: string): Promise<OrderDocument[]> {
        try {
            return await Order.find({ user: email });
        } catch (error) {
            throw error;
        }
    }
}

export const orderService = new OrderService();

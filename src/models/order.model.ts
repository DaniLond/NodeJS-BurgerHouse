import { Schema, model, Document } from "mongoose";

export interface Topping {
    topping_id: string;
    quantity: number;
}

export interface Product {
    product_id: string;
    quantity: number;
    toppings?: Topping[];
}

export interface OrderInput {
    user: string;  
    total: number;
    date: Date;   
    state: string; 
    products: Product[]; 
    address: string; 
}

export interface OrderDocument extends OrderInput, Document {}

const orderSchema = new Schema<OrderDocument>({
    user: { type: String, required: true },
    total: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    state: { 
        type: String, 
        required: true, 
        enum: ["Pendiente", "En preparación", "Listo", "En camino", "Entregado"], 
        default: "Pendiente" 
    },
    products: [
        {
            product_id: { type: String, required: true }, 
            quantity: { type: Number, required: true, min: 1 },
            toppings: [
                {
                    topping_id: String,
                    quantity: Number
                }
            ]
        }
    ],
    address: { type: String, required: true }
});

export const Order = model<OrderDocument>("Order", orderSchema);

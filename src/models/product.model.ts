import mongoose  from "mongoose";

export type Category= 'Hamburguesas' | 'Bebidas' | 'Acompañamientos';

export interface ProductInput{
    name: string,
    description: string,
    price: number,
    category: Category,
}

export interface ProductDocument extends ProductInput, mongoose.Document{}

const productSchema = new mongoose.Schema({
    name:{ type: String, required: true, unique: true },
    description: String,
    price:{ type: Number, required: true },
    category: { type: String, enum: ['Hamburguesas', 'Bebidas', 'Acompañamientos'], required: true },
});

export const ProductModel = mongoose.model<ProductDocument>("Product", productSchema);
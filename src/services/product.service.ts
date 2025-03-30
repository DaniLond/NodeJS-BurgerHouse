import { ProductDocument, ProductInput, ProductModel } from "../models";

class ProductService{
    async create(data: ProductDocument){
        try{
            const product = await ProductModel.create(data);
            return product;
        }catch(error){
            throw error;
        }
    }

    async delete(name: string){
        try {
            const product= await ProductModel.findOneAndDelete({name: name});
            return product;
        } catch (error) {
            throw error;
        }

    }

    async findByEmail(name:string){
        try{
            const product = await ProductModel.findOne({ name : name});
            return product;
        }catch(error){
            throw error;
        }
    }

    async getAll():Promise<ProductDocument[]>{
        try{
            const products: ProductDocument[] = await ProductModel.find();
            return products;
        }catch(error){
            console.log(error);
            throw error;
        }
    }

    async update(name:string, product: ProductInput){
        try{
            const productUpdate: ProductDocument | null = await ProductModel.findOneAndUpdate( { name: name}, product, {returnOriginal: false} );
            return productUpdate;
        }catch(error){
            throw error;
        }
    }

}

export const productService = new ProductService();
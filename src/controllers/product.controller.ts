import { Request, Response } from "express";
import { productService } from "../services";
import { ProductDocument, ProductInput } from "../models";

class ProductController{

    async create(req: Request, res: Response){
        try{
            const productExist : ProductDocument | null = await productService.findByEmail(req.body.name);
            if(productExist){
                res.status(400).json({message: `the product ${req.body.name} already exist!`});
                return;
            }
            const product: ProductDocument = await productService.create(req.body);
            res.status(201).json(product);

        }catch(error){
            res.status(500).json(`the product hasn't been created`)
            return;
        }
    }

    async delete(req: Request, res: Response){
        try {
            const name: string = req.params.name;
            const product: ProductDocument | null = await productService.delete(name);
            if(product === null){
               res.status(404).json({message: `Product ${name} not found.`}) ;
               return;
            }
            res.json(product);
        } catch (error) {
            res.status(500).json({message: `The product ${req.body.name} cannot be delete.`})
        }
    }

    async findAll(req: Request, res: Response){
        try{
            const products: ProductDocument[] = await productService.getAll();
            res.json(products);
        }catch(error){
            throw error;
        }
    }

    async update(req: Request, res: Response){
        try{
            const name: string = req.params.name;
            const product: ProductDocument | null = await productService.update(name, req.body as ProductInput);
            if(product === null){
                res.status(404).json({message: `Product ${name} not found.`})
            }
            res.json(product);
        }catch(error){
            res.status(500).json({message: `The product ${req.body.name} cannot be updated.`})
        }
    }



}
export const productController = new ProductController();
import { productController } from '../../controllers/product.controller';
import { productService } from '../../services/product.service';
import { Request, Response } from 'express';
import { ProductDocument, ProductInput } from '../../models/product.model';

jest.mock('../../services/product.service');

describe('Product Controller Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  
  beforeEach(() => {
    mockReq = {};
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  it('findAll debe retornar todos los productos', async () => {
    const mockProducts: ProductDocument[] = [
      {
        name: 'Hamburguesa Clásica',
        description: 'Hamburguesa con carne, lechuga y tomate',
        price: 10.99,
        category: 'Hamburguesas'
      } as ProductDocument,
      {
        name: 'Coca Cola',
        description: 'Bebida gaseosa',
        price: 2.50,
        category: 'Bebidas'
      } as ProductDocument
    ];

    (productService.getAll as jest.Mock).mockResolvedValue(mockProducts);
    
    await productController.findAll(mockReq as Request, mockRes as Response);
    
    expect(productService.getAll).toHaveBeenCalled();
    expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
  });

  it('create debe crear un nuevo producto cuando no existe previamente', async () => {
    const newProduct: ProductInput = {
      name: 'Papas Fritas',
      description: 'Porción de papas fritas',
      price: 5.99,
      category: 'Acompañamientos'
    };

    mockReq.body = newProduct;
    
    (productService.findByEmail as jest.Mock).mockResolvedValue(null);
    (productService.create as jest.Mock).mockResolvedValue({
      ...newProduct,
      _id: '123456789'
    } as ProductDocument);
    
    await productController.create(mockReq as Request, mockRes as Response);
    
    expect(productService.findByEmail).toHaveBeenCalledWith(newProduct.name);
    expect(productService.create).toHaveBeenCalledWith(newProduct);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining(newProduct));
  });

  it('create debe retornar error 400 si el producto ya existe', async () => {
    const existingProduct: ProductInput = {
      name: 'Hamburguesa Clásica',
      description: 'Hamburguesa con carne, lechuga y tomate',
      price: 10.99,
      category: 'Hamburguesas'
    };

    mockReq.body = existingProduct;
    
    (productService.findByEmail as jest.Mock).mockResolvedValue(existingProduct as ProductDocument);
    
    await productController.create(mockReq as Request, mockRes as Response);
    
    expect(productService.findByEmail).toHaveBeenCalledWith(existingProduct.name);
    expect(productService.create).not.toHaveBeenCalled();
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({message: `the product ${existingProduct.name} already exist!`});
  });

  it('delete debe eliminar un producto existente', async () => {
    const productName = 'Hamburguesa Clásica';
    const deletedProduct = {
      name: productName,
      description: 'Hamburguesa con carne, lechuga y tomate',
      price: 10.99,
      category: 'Hamburguesas'
    } as ProductDocument;

    mockReq.params = { name: productName };
    
    (productService.delete as jest.Mock).mockResolvedValue(deletedProduct);
    
    await productController.delete(mockReq as Request, mockRes as Response);
    
    expect(productService.delete).toHaveBeenCalledWith(productName);
    expect(mockRes.json).toHaveBeenCalledWith(deletedProduct);
  });

  it('delete debe retornar error 404 si el producto no existe', async () => {
    const productName = 'Producto Inexistente';

    mockReq.params = { name: productName };
    
    (productService.delete as jest.Mock).mockResolvedValue(null);
    
    await productController.delete(mockReq as Request, mockRes as Response);
    
    expect(productService.delete).toHaveBeenCalledWith(productName);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({message: `Product ${productName} not found.`});
  });

  it('update debe actualizar un producto existente', async () => {
    const productName = 'Hamburguesa Clásica';
    const updatedProductData: ProductInput = {
      name: 'Hamburguesa Clásica',
      description: 'Hamburguesa actualizada con carne premium',
      price: 12.99,
      category: 'Hamburguesas'
    };

    mockReq.params = { name: productName };
    mockReq.body = updatedProductData;
    
    const updatedProduct = {
      ...updatedProductData,
      _id: '123456789'
    } as ProductDocument;
    
    (productService.update as jest.Mock).mockResolvedValue(updatedProduct);
    
    await productController.update(mockReq as Request, mockRes as Response);
    
    expect(productService.update).toHaveBeenCalledWith(productName, updatedProductData);
    expect(mockRes.json).toHaveBeenCalledWith(updatedProduct);
  });

  it('update debe retornar error 404 si el producto no existe', async () => {
    const productName = 'Producto Inexistente';
    const updatedProductData: ProductInput = {
      name: 'Producto Actualizado',
      description: 'Descripción actualizada',
      price: 15.99,
      category: 'Hamburguesas'
    };

    mockReq.params = { name: productName };
    mockReq.body = updatedProductData;
    
    (productService.update as jest.Mock).mockResolvedValue(null);
    
    await productController.update(mockReq as Request, mockRes as Response);
    
    expect(productService.update).toHaveBeenCalledWith(productName, updatedProductData);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({message: `Product ${productName} not found.`});
  });

  it('debe manejar errores internos al crear un producto', async () => {
    const newProduct: ProductInput = {
      name: 'Producto Error',
      description: 'Descripción',
      price: 9.99,
      category: 'Acompañamientos'
    };

    mockReq.body = newProduct;
    
    (productService.findByEmail as jest.Mock).mockResolvedValue(null);
    (productService.create as jest.Mock).mockRejectedValue(new Error('Error de servidor'));
    
    await productController.create(mockReq as Request, mockRes as Response);
    
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(`the product hasn't been created`);
  });
});
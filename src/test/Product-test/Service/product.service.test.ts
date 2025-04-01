import { productService } from '../../../services/product.service';
import { ProductDocument, ProductInput, ProductModel } from '../../../models/product.model';
import mongoose from 'mongoose';


jest.mock('../../../models/product.model');

describe('Product Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create debe crear un nuevo producto correctamente', async () => {
    const productData: ProductInput = {
      name: 'Hamburguesa Doble',
      description: 'Hamburguesa con doble carne y queso',
      price: 15.99,
      category: 'Hamburguesas'
    };

    const expectedProduct = {
      ...productData,
      _id: new mongoose.Types.ObjectId(),
    } as ProductDocument;

    (ProductModel.create as jest.Mock).mockResolvedValue(expectedProduct);

    const result = await productService.create(productData as ProductDocument);

    expect(ProductModel.create).toHaveBeenCalledWith(productData);
    expect(result).toEqual(expectedProduct);
  });

  it('create debe propagar errores que ocurran durante la creación', async () => {
    const productData: ProductInput = {
      name: 'Hamburguesa Inválida',
      description: 'Descripción',
      price: 15.99,
      category: 'Hamburguesas'
    };

    const errorMessage = 'Error al crear producto';
    (ProductModel.create as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(productService.create(productData as ProductDocument)).rejects.toThrow(errorMessage);
    expect(ProductModel.create).toHaveBeenCalledWith(productData);
  });

  it('delete debe eliminar un producto por su nombre', async () => {
    const productName = 'Hamburguesa Clásica';
    const deletedProduct = {
      _id: new mongoose.Types.ObjectId(),
      name: productName,
      description: 'Hamburguesa con carne, lechuga y tomate',
      price: 10.99,
      category: 'Hamburguesas'
    } as ProductDocument;

    (ProductModel.findOneAndDelete as jest.Mock).mockResolvedValue(deletedProduct);

    const result = await productService.delete(productName);

    expect(ProductModel.findOneAndDelete).toHaveBeenCalledWith({ name: productName });
    expect(result).toEqual(deletedProduct);
  });

  it('delete debe retornar null si el producto no existe', async () => {
    const productName = 'Producto Inexistente';

    (ProductModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);

    const result = await productService.delete(productName);

    expect(ProductModel.findOneAndDelete).toHaveBeenCalledWith({ name: productName });
    expect(result).toBeNull();
  });

  it('delete debe propagar errores que ocurran durante la eliminación', async () => {
    const productName = 'Hamburguesa Error';
    const errorMessage = 'Error al eliminar producto';

    (ProductModel.findOneAndDelete as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(productService.delete(productName)).rejects.toThrow(errorMessage);
    expect(ProductModel.findOneAndDelete).toHaveBeenCalledWith({ name: productName });
  });

  it('findByEmail debe encontrar un producto por su nombre', async () => {
    const productName = 'Coca Cola';
    const foundProduct = {
      _id: new mongoose.Types.ObjectId(),
      name: productName,
      description: 'Bebida gaseosa',
      price: 2.50,
      category: 'Bebidas'
    } as ProductDocument;

    (ProductModel.findOne as jest.Mock).mockResolvedValue(foundProduct);

    const result = await productService.findByEmail(productName);

    expect(ProductModel.findOne).toHaveBeenCalledWith({ name: productName });
    expect(result).toEqual(foundProduct);
  });

  it('findByEmail debe retornar null si el producto no existe', async () => {
    const productName = 'Producto Inexistente';

    (ProductModel.findOne as jest.Mock).mockResolvedValue(null);

    const result = await productService.findByEmail(productName);

    expect(ProductModel.findOne).toHaveBeenCalledWith({ name: productName });
    expect(result).toBeNull();
  });

  it('getAll debe obtener todos los productos', async () => {
    const mockProducts: ProductDocument[] = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Hamburguesa Clásica',
        description: 'Hamburguesa con carne, lechuga y tomate',
        price: 10.99,
        category: 'Hamburguesas'
      } as ProductDocument,
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Coca Cola',
        description: 'Bebida gaseosa',
        price: 2.50,
        category: 'Bebidas'
      } as ProductDocument
    ];

    (ProductModel.find as jest.Mock).mockResolvedValue(mockProducts);

    const result = await productService.getAll();

    expect(ProductModel.find).toHaveBeenCalled();
    expect(result).toEqual(mockProducts);
    expect(result.length).toBe(2);
  });

  it('getAll debe propagar errores que ocurran durante la búsqueda', async () => {
    const errorMessage = 'Error al obtener productos';

    (ProductModel.find as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(productService.getAll()).rejects.toThrow(errorMessage);
    expect(ProductModel.find).toHaveBeenCalled();
  });

  it('update debe actualizar un producto por su nombre', async () => {
    const productName = 'Hamburguesa Clásica';
    const updatedData: ProductInput = {
      name: 'Hamburguesa Clásica',
      description: 'Hamburguesa actualizada con carne premium',
      price: 12.99,
      category: 'Hamburguesas'
    };

    const updatedProduct = {
      _id: new mongoose.Types.ObjectId(),
      ...updatedData
    } as ProductDocument;

    (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProduct);

    const result = await productService.update(productName, updatedData);

    expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
      { name: productName }, 
      updatedData, 
      { returnOriginal: false }
    );
    expect(result).toEqual(updatedProduct);
  });

  it('update debe retornar null si el producto no existe', async () => {
    const productName = 'Producto Inexistente';
    const updatedData: ProductInput = {
      name: 'Producto Actualizado',
      description: 'Descripción actualizada',
      price: 15.99,
      category: 'Hamburguesas'
    };

    (ProductModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

    const result = await productService.update(productName, updatedData);

    expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
      { name: productName }, 
      updatedData, 
      { returnOriginal: false }
    );
    expect(result).toBeNull();
  });

  it('update debe propagar errores que ocurran durante la actualización', async () => {
    const productName = 'Hamburguesa Error';
    const updatedData: ProductInput = {
      name: 'Hamburguesa Error',
      description: 'Descripción actualizada',
      price: 15.99,
      category: 'Hamburguesas'
    };
    const errorMessage = 'Error al actualizar producto';

    (ProductModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(productService.update(productName, updatedData)).rejects.toThrow(errorMessage);
    expect(ProductModel.findOneAndUpdate).toHaveBeenCalledWith(
      { name: productName }, 
      updatedData, 
      { returnOriginal: false }
    );
  });
});
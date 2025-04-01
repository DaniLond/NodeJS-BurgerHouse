import { orderService } from '../../../services/order.service';
import { Order, OrderDocument, OrderInput } from '../../../models/order.model';

jest.mock('../../../models/order.model', () => {
  const mockOrderDocument = {
    _id: 'mockId123',
    user: 'test@example.com',
    total: 25.99,
    date: new Date('2025-03-01'),
    state: 'Pendiente',
    products: [
      {
        product_id: 'product123',
        quantity: 2,
        toppings: [{ topping_id: 'topping123', quantity: 1 }]
      }
    ],
    address: 'Calle Test 123'
  };

  return {
    Order: {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn()
    },
    OrderDocument: mockOrderDocument
  };
});

describe('Order Service Tests', () => {
  const mockOrderInput: OrderInput = {
    user: 'test@example.com',
    total: 25.99,
    date: new Date('2025-03-01'),
    state: 'Pendiente',
    products: [
      {
        product_id: 'product123',
        quantity: 2,
        toppings: [{ topping_id: 'topping123', quantity: 1 }]
      }
    ],
    address: 'Calle Test 123'
  };

  const mockOrderDocument: OrderDocument = {
    _id: 'mockId123',
    ...mockOrderInput
  } as unknown as OrderDocument;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('debe crear una nueva orden', async () => {
      (Order.create as jest.Mock).mockResolvedValue(mockOrderDocument);

      const result = await orderService.create(mockOrderInput);

      expect(Order.create).toHaveBeenCalledWith(mockOrderInput);
      expect(result).toEqual(mockOrderDocument);
    });

    it('debe propagar errores durante la creación', async () => {
      const error = new Error('Error de base de datos');
      (Order.create as jest.Mock).mockRejectedValue(error);

      await expect(orderService.create(mockOrderInput)).rejects.toThrow(error);
      expect(Order.create).toHaveBeenCalledWith(mockOrderInput);
    });
  });

  describe('getAll', () => {
    it('debe retornar todas las órdenes', async () => {
      const mockOrders = [mockOrderDocument, { ...mockOrderDocument, _id: 'mockId456' }];
      (Order.find as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderService.getAll();

      expect(Order.find).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });

    it('debe propagar errores al obtener todas las órdenes', async () => {
      const error = new Error('Error de conexión');
      (Order.find as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getAll()).rejects.toThrow(error);
      expect(Order.find).toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    it('debe retornar una orden por su ID', async () => {
      (Order.findById as jest.Mock).mockResolvedValue(mockOrderDocument);

      const result = await orderService.getById('mockId123');

      expect(Order.findById).toHaveBeenCalledWith('mockId123');
      expect(result).toEqual(mockOrderDocument);
    });

    it('debe retornar null si no encuentra la orden', async () => {
      (Order.findById as jest.Mock).mockResolvedValue(null);

      const result = await orderService.getById('nonExistentId');

      expect(Order.findById).toHaveBeenCalledWith('nonExistentId');
      expect(result).toBeNull();
    });

    it('debe propagar errores al buscar por ID', async () => {
      const error = new Error('ID inválido');
      (Order.findById as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getById('invalidId')).rejects.toThrow(error);
      expect(Order.findById).toHaveBeenCalledWith('invalidId');
    });
  });

  describe('update', () => {
    it('debe actualizar una orden exitosamente', async () => {
      const updateData = { 
        state: 'En preparación',
        address: 'Nueva dirección 456'
      };
      const updatedOrder = { 
        ...mockOrderDocument, 
        ...updateData 
      };

      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedOrder);

      const result = await orderService.update('mockId123', updateData);

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('mockId123', updateData, { returnOriginal: false });
      expect(result).toEqual(updatedOrder);
    });

    it('debe retornar null si no encuentra la orden para actualizar', async () => {
      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await orderService.update('nonExistentId', { state: 'En preparación' });

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('nonExistentId', { state: 'En preparación' }, { returnOriginal: false });
      expect(result).toBeNull();
    });

    it('debe propagar errores durante la actualización', async () => {
      const error = new Error('Error de actualización');
      (Order.findByIdAndUpdate as jest.Mock).mockRejectedValue(error);

      await expect(orderService.update('mockId123', { state: 'En preparación' })).rejects.toThrow(error);
      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith('mockId123', { state: 'En preparación' }, { returnOriginal: false });
    });
  });

  describe('delete', () => {
    it('debe eliminar una orden exitosamente', async () => {
      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(mockOrderDocument);

      const result = await orderService.delete('mockId123');

      expect(Order.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
      expect(result).toEqual(mockOrderDocument);
    });

    it('debe retornar null si no encuentra la orden para eliminar', async () => {
      (Order.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      const result = await orderService.delete('nonExistentId');

      expect(Order.findByIdAndDelete).toHaveBeenCalledWith('nonExistentId');
      expect(result).toBeNull();
    });

    it('debe propagar errores durante la eliminación', async () => {
      const error = new Error('Error de eliminación');
      (Order.findByIdAndDelete as jest.Mock).mockRejectedValue(error);

      await expect(orderService.delete('mockId123')).rejects.toThrow(error);
      expect(Order.findByIdAndDelete).toHaveBeenCalledWith('mockId123');
    });
  });

 
    it('debe retornar null si no encuentra la orden para actualizar estado', async () => {
      (Order.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const result = await orderService.updateStatus('nonExistentId', 'En preparación');

      expect(Order.findByIdAndUpdate).toHaveBeenCalledWith(
        'nonExistentId',
        { state: 'En preparación' },
        { new: true, runValidators: true }
      );
      expect(result).toBeNull();
    });

   

  describe('getByUserEmail', () => {
    it('debe obtener órdenes por email de usuario', async () => {
      const userOrders = [mockOrderDocument, { ...mockOrderDocument, _id: 'mockId456' }];
      (Order.find as jest.Mock).mockResolvedValue(userOrders);

      const result = await orderService.getByUserEmail('test@example.com');

      expect(Order.find).toHaveBeenCalledWith({ user: 'test@example.com' });
      expect(result).toEqual(userOrders);
    });

    it('debe retornar un array vacío si no hay órdenes para el usuario', async () => {
      (Order.find as jest.Mock).mockResolvedValue([]);

      const result = await orderService.getByUserEmail('noorders@example.com');

      expect(Order.find).toHaveBeenCalledWith({ user: 'noorders@example.com' });
      expect(result).toEqual([]);
    });

    it('debe propagar errores al buscar órdenes por email', async () => {
      const error = new Error('Error de consulta');
      (Order.find as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getByUserEmail('test@example.com')).rejects.toThrow(error);
      expect(Order.find).toHaveBeenCalledWith({ user: 'test@example.com' });
    });
  });
});
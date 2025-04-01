import { orderController } from '../../controllers/order.controller';
import { orderService } from '../../services/order.service';
import { securityService } from '../../services';
import { Request, Response } from 'express';
import { OrderDocument, OrderInput } from '../../models/order.model';

jest.mock('../../services/order.service');
jest.mock('../../services');

describe('Order Controller Tests', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  
  beforeEach(() => {
    mockReq = {
      headers: {
        authorization: 'Bearer token'
      },
      params: {},
      body: {},
      header: jest.fn().mockReturnValue('Bearer token')
    };
    mockRes = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    jest.clearAllMocks();
  });

  const mockOrder: OrderDocument = {
    _id: '123456789',
    user: 'test@example.com',
    total: 25.99,
    date: new Date(),
    state: 'Pendiente',
    products: [
      {
        product_id: 'product123',
        quantity: 2,
        toppings: [
          { topping_id: 'topping123', quantity: 1 }
        ]
      }
    ],
    address: 'Calle Test 123'
  } as OrderDocument;

  const mockOrderInput: OrderInput = {
    user: 'test@example.com',
    total: 25.99,
    date: new Date(),
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

  describe('create', () => {
    it('debe crear una nueva orden', async () => {
      mockReq.body = mockOrderInput;
      
      (orderService.create as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.create(mockReq as Request, mockRes as Response);
      
      expect(orderService.create).toHaveBeenCalledWith(mockOrderInput);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('debe manejar errores al crear una orden', async () => {
      mockReq.body = mockOrderInput;
      
      (orderService.create as jest.Mock).mockRejectedValue(new Error('Error al crear'));
      
      await orderController.create(mockReq as Request, mockRes as Response);
      
      expect(orderService.create).toHaveBeenCalledWith(mockOrderInput);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Error al crear la orden" });
    });
  });

  describe('getAll', () => {
    it('debe retornar todas las órdenes', async () => {
      const mockOrders = [mockOrder, { ...mockOrder, _id: '987654321' } as OrderDocument];
      
      (orderService.getAll as jest.Mock).mockResolvedValue(mockOrders);
      
      await orderController.getAll(mockReq as Request, mockRes as Response);
      
      expect(orderService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });

    it('debe manejar errores al obtener todas las órdenes', async () => {
      (orderService.getAll as jest.Mock).mockRejectedValue(new Error('Error de base de datos'));
      
      await orderController.getAll(mockReq as Request, mockRes as Response);
      
      expect(orderService.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Error al obtener órdenes" });
    });
  });

  describe('getById', () => {
    it('debe retornar una orden específica si el usuario es admin', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.headers = { authorization: 'Bearer token' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.getById(mockReq as Request, mockRes as Response);
      
      expect(securityService.getClaims).toHaveBeenCalledWith('Bearer token');
      expect(orderService.getById).toHaveBeenCalledWith('123456789');
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('debe retornar una orden si el usuario es el propietario', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.headers = { authorization: 'Bearer token' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'test@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.getById(mockReq as Request, mockRes as Response);
      
      expect(securityService.getClaims).toHaveBeenCalledWith('Bearer token');
      expect(orderService.getById).toHaveBeenCalledWith('123456789');
      expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
    });

    it('debe retornar 403 si el usuario customer no es el propietario', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.headers = { authorization: 'Bearer token' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'otro@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.getById(mockReq as Request, mockRes as Response);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No tienes permiso para ver esta orden" });
    });

    it('debe retornar 404 si la orden no existe', async () => {
      mockReq.params = { id: 'invalid-id' };
      mockReq.headers = { authorization: 'Bearer token' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(null);
      
      await orderController.getById(mockReq as Request, mockRes as Response);
      
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden no encontrada" });
    });

  });

  describe('update', () => {
    it('debe actualizar una orden si el usuario es admin', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = { ...mockOrderInput, state: 'En preparación' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      (orderService.update as jest.Mock).mockResolvedValue({ ...mockOrder, state: 'En preparación' });
      
      await orderController.update(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(securityService.getClaims).toHaveBeenCalledWith('Bearer token');
      expect(orderService.getById).toHaveBeenCalledWith('123456789');
      expect(orderService.update).toHaveBeenCalledWith('123456789', { ...mockOrderInput, state: 'En preparación' });
      expect(mockRes.json).toHaveBeenCalledWith({ ...mockOrder, state: 'En preparación' });
    });

    it('debe actualizar una orden si el usuario es el propietario', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = { ...mockOrderInput, address: 'Nueva Dirección' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'test@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      (orderService.update as jest.Mock).mockResolvedValue({ ...mockOrder, address: 'Nueva Dirección' });
      
      await orderController.update(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(orderService.update).toHaveBeenCalledWith('123456789', { ...mockOrderInput, address: 'Nueva Dirección' });
      expect(mockRes.json).toHaveBeenCalledWith({ ...mockOrder, address: 'Nueva Dirección' });
    });

    it('debe retornar 403 si el usuario customer no es el propietario', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = { ...mockOrderInput };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'otro@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.update(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No puedes actualizar pedidos de otros usuarios" });
    });

    it('debe retornar 404 si la orden no existe', async () => {
      mockReq.params = { id: 'invalid-id' };
      mockReq.body = { ...mockOrderInput };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(null);
      
      await orderController.update(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden no encontrada" });
    });

    it('debe retornar 401 si no hay token de autorización', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = { ...mockOrderInput };
      mockReq.header = jest.fn().mockReturnValue(null);
      
      await orderController.update(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No autorizado" });
    });
  });

  describe('delete', () => {
    it('debe eliminar una orden si el usuario es admin', async () => {
      mockReq.params = { id: '123456789' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      (orderService.delete as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.delete(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(orderService.delete).toHaveBeenCalledWith('123456789');
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden eliminada correctamente" });
    });

    it('debe eliminar una orden en estado Pendiente si el usuario es el propietario', async () => {
      const pendingOrder = { ...mockOrder, state: 'Pendiente' };
      mockReq.params = { id: '123456789' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'test@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(pendingOrder);
      (orderService.delete as jest.Mock).mockResolvedValue(pendingOrder);
      
      await orderController.delete(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(orderService.delete).toHaveBeenCalledWith('123456789');
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden eliminada correctamente" });
    });

    it('debe retornar 403 si el usuario customer no es el propietario', async () => {
      mockReq.params = { id: '123456789' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'customer', email: 'otro@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(mockOrder);
      
      await orderController.delete(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No puedes eliminar pedidos de otros usuarios" });
    });

    it('debe retornar 404 si la orden no existe', async () => {
      mockReq.params = { id: 'invalid-id' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'admin', email: 'admin@example.com' });
      (orderService.getById as jest.Mock).mockResolvedValue(null);
      
      await orderController.delete(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden no encontrada" });
    });

    it('debe retornar 401 si no hay token de autorización', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.header = jest.fn().mockReturnValue(null);
      
      await orderController.delete(mockReq as Request, mockRes as Response);
      
      expect(mockReq.header).toHaveBeenCalledWith('Authorization');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "No autorizado" });
    });

  });

  describe('updateStatus', () => {
    it('debe actualizar el estado de una orden', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = { state: 'En preparación' };
      
      (orderService.updateStatus as jest.Mock).mockResolvedValue({ ...mockOrder, state: 'En preparación' });
      
      await orderController.updateStatus(mockReq as Request, mockRes as Response);
      
      expect(orderService.updateStatus).toHaveBeenCalledWith('123456789', 'En preparación');
      expect(mockRes.json).toHaveBeenCalledWith({ ...mockOrder, state: 'En preparación' });
    });

    it('debe retornar 400 si no se proporciona el estado', async () => {
      mockReq.params = { id: '123456789' };
      mockReq.body = {};
      
      await orderController.updateStatus(mockReq as Request, mockRes as Response);
      
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "El estado es obligatorio" });
    });

    it('debe retornar 404 si la orden no existe', async () => {
      mockReq.params = { id: 'invalid-id' };
      mockReq.body = { state: 'En preparación' };
      
      (orderService.updateStatus as jest.Mock).mockResolvedValue(null);
      
      await orderController.updateStatus(mockReq as Request, mockRes as Response);
      
      expect(orderService.updateStatus).toHaveBeenCalledWith('invalid-id', 'En preparación');
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Orden no encontrada" });
    });

    
  });

  describe('gestión de roles', () => {
    it('debe permitir a un dealer ver todas las órdenes', async () => {
      const mockOrders = [mockOrder, { ...mockOrder, _id: '987654321' } as OrderDocument];
      mockReq.headers = { authorization: 'Bearer token' };
      
      (securityService.getClaims as jest.Mock).mockResolvedValue({ role: 'dealer', email: 'dealer@example.com' });
      (orderService.getAll as jest.Mock).mockResolvedValue(mockOrders);
      
      await orderController.getAll(mockReq as Request, mockRes as Response);
      
      expect(orderService.getAll).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
    });
  });
});
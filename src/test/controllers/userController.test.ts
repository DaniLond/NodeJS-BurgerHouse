import { Request, Response } from 'express';
import { userController } from '../../controllers';
import { userService, securityService } from '../../services';

// Mocks para servicios
jest.mock('../../services', () => ({
  userService: {
    create: jest.fn(),
    delete: jest.fn(),
    findByEmail: jest.fn(),
    getAll: jest.fn(),
    update: jest.fn()
  },
  securityService: {
    encryptPassword: jest.fn(),
    comparePasswords: jest.fn(),
    generateToken: jest.fn()
  }
}));

describe('User Controller Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('create method', () => {
    it('debería crear un usuario correctamente', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'customer'
      };
      
      mockRequest.body = userData;
      
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      (securityService.encryptPassword as jest.Mock).mockResolvedValue('hashed_password');
      (userService.create as jest.Mock).mockResolvedValue({
        ...userData,
        password: 'hashed_password'
      });
      
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(securityService.encryptPassword).toHaveBeenCalledWith('password123');
      expect(userService.create).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        ...userData,
        password: 'hashed_password'
      });
    });

    it('debería rechazar la creación si el usuario ya existe', async () => {
      mockRequest.body = { email: 'existing@example.com' };
      
      (userService.findByEmail as jest.Mock).mockResolvedValue({ email: 'existing@example.com' });
      
      await userController.create(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({message: `the user ${mockRequest.body.email} already exist!`});
      expect(userService.create).not.toHaveBeenCalled();
    });

  });

  describe('delete method', () => {
    it('debería eliminar un usuario correctamente', async () => {
      mockRequest.params = { email: 'test@example.com' };
      
      const deletedUser = {
        name: 'Test User',
        email: 'test@example.com'
      };
      
      (userService.delete as jest.Mock).mockResolvedValue(deletedUser);
      
      await userController.delete(mockRequest as Request, mockResponse as Response);
      
      expect(userService.delete).toHaveBeenCalledWith('test@example.com');
      expect(mockResponse.json).toHaveBeenCalledWith(deletedUser);
    });

    it('debería manejar usuario no encontrado para eliminar', async () => {
      mockRequest.params = { email: 'nonexistent@example.com' };
      
      (userService.delete as jest.Mock).mockResolvedValue(null);
      
      await userController.delete(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({message: `User ${mockRequest.params.email} not found.`});
    });
  });

  describe('findAll method', () => {
    it('debería obtener todos los usuarios', async () => {
      const users = [
        { name: 'User 1', email: 'user1@example.com' },
        { name: 'User 2', email: 'user2@example.com' }
      ];
      
      (userService.getAll as jest.Mock).mockResolvedValue(users);
      
      await userController.findAll(mockRequest as Request, mockResponse as Response);
      
      expect(userService.getAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(users);
    });

  });

  describe('login method', () => {
    it('debería autenticar a un usuario correctamente', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = {
        id: 'user_id',
        email: 'test@example.com',
        password: 'hashed_password',
        role: 'customer'
      };
      
      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (securityService.comparePasswords as jest.Mock).mockResolvedValue(true);
      (securityService.generateToken as jest.Mock).mockResolvedValue('jwt_token');
      
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      expect(userService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(securityService.comparePasswords).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(securityService.generateToken).toHaveBeenCalledWith('user_id', 'test@example.com', 'customer');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'login successfull',
        token: 'jwt_token'
      });
    });

    it('debería rechazar la autenticación con email no existente', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      (userService.findByEmail as jest.Mock).mockResolvedValue(null);
      
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: `user ${mockRequest.body.email} not found.` });
    });

    it('debería rechazar la autenticación con contraseña incorrecta', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrong_password'
      };
      
      const user = {
        email: 'test@example.com',
        password: 'hashed_password'
      };
      
      (userService.findByEmail as jest.Mock).mockResolvedValue(user);
      (securityService.comparePasswords as jest.Mock).mockResolvedValue(false);
      
      await userController.login(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User or password incorrect' });
    });

  });

  describe('update method', () => {
    it('debería actualizar un usuario correctamente', async () => {
      mockRequest.params = { email: 'test@example.com' };
      mockRequest.body = {
        name: 'Updated Name',
        role: 'admin'
      };
      
      const updatedUser = {
        name: 'Updated Name',
        email: 'test@example.com',
        role: 'admin',
        password: ''
      };
      
      (userService.update as jest.Mock).mockResolvedValue(updatedUser);
      
      await userController.update(mockRequest as Request, mockResponse as Response);
      
      expect(userService.update).toHaveBeenCalledWith('test@example.com', mockRequest.body);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });

    it('debería manejar usuario no encontrado para actualizar', async () => {
      mockRequest.params = { email: 'nonexistent@example.com' };
      mockRequest.body = { name: 'Updated Name' };
      
      (userService.update as jest.Mock).mockResolvedValue(null);
      
      await userController.update(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({message: `User ${mockRequest.params.email} not found.`});
    });


    it('debería manejar actualización con datos inválidos', async () => {
      mockRequest.params = { email: 'test@example.com' };
      mockRequest.body = {
        role: 'invalid_role' // Rol inválido
      };
      
      (userService.update as jest.Mock).mockRejectedValue(new Error('Validation failed'));
      
      await userController.update(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({message: `The user ${mockRequest.body.email} cannot be updated.`});
    });
  });
});

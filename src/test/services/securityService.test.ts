import { securityService } from '../../services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('SecurityService Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('encryptPassword', () => {
    it('Debería cifrar una contraseña usando bcrypt', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedTestPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await securityService.encryptPassword(password);

      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
      expect(bcrypt.hash).toHaveBeenCalledTimes(1);
    });

    it('Debería generar un error si el hash bcrypt falla', async () => {
      const password = 'testPassword123';
      const errorMessage = 'Hashing failed';
      (bcrypt.hash as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(securityService.encryptPassword(password)).rejects.toThrow(errorMessage);
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    });
  });

  describe('generateToken', () => {
    it('Debe generar un token JWT con la carga útil y las opciones correctas', async () => {
      const _id = new mongoose.Types.ObjectId();
      const email = 'test@example.com';
      const role = 'admin';
      const token = 'generatedJwtToken';
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await securityService.generateToken(_id, email, role);

      expect(result).toBe(token);
      expect(jwt.sign).toHaveBeenCalledWith({ _id, email, role }, 'secret', { expiresIn: '1h' });
      expect(jwt.sign).toHaveBeenCalledTimes(1);
    });

    it('Debería generar un error si falla la firma JWT', async () => {
      const _id = new mongoose.Types.ObjectId();
      const email = 'test@example.com';
      const role = 'admin';
      const errorMessage = 'Token generation failed';
      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      await expect(securityService.generateToken(_id, email, role)).rejects.toThrow(errorMessage);
      expect(jwt.sign).toHaveBeenCalledWith({ _id, email, role }, 'secret', { expiresIn: '1h' });
    });
  });

  describe('comparePasswords', () => {
    it('Debería devolver verdadero cuando las contraseñas coincidan', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedTestPassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await securityService.comparePasswords(password, hashedPassword);

      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('Debería devolver falso cuando las contraseñas no coincidan', async () => {
      const password = 'testPassword123';
      const hashedPassword = 'hashedTestPassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await securityService.comparePasswords(password, hashedPassword);

      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(bcrypt.compare).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if bcrypt compare fails', async () => {
      // Arrange
      const password = 'testPassword123';
      const hashedPassword = 'hashedTestPassword';
      const errorMessage = 'Compare failed';
      (bcrypt.compare as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(securityService.comparePasswords(password, hashedPassword)).rejects.toThrow(errorMessage);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });

  describe('getClaims', () => {
    it('Debería extraer correctamente los claims de un token válido', async () => {
      // Arrange
      const token = 'Bearer validToken123';
      const decodedToken = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        role: 'user'
      };
      (jwt.verify as jest.Mock).mockReturnValue(decodedToken);

      // Act
      const result = await securityService.getClaims(token);

      // Assert
      expect(result).toEqual({
        _id: decodedToken._id,
        email: decodedToken.email,
        role: decodedToken.role
      });
      expect(jwt.verify).toHaveBeenCalledWith('validToken123', 'secret');
      expect(jwt.verify).toHaveBeenCalledTimes(1);
    });

    it('Debería lanzar un error si no se proporciona un token', async () => {
      // Act & Assert
      await expect(securityService.getClaims(undefined)).rejects.toThrow('Token no proporcionado');
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('Debería lanzar un error si el formato del token es inválido', async () => {
      // Arrange
      const invalidToken = 'invalidTokenFormat';

      // Act & Assert
      await expect(securityService.getClaims(invalidToken)).rejects.toThrow('Token inválido');
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('Debería lanzar un error si el prefijo del token no es "Bearer"', async () => {
      // Arrange
      const invalidToken = 'Invalid validToken123';

      // Act & Assert
      await expect(securityService.getClaims(invalidToken)).rejects.toThrow('Token inválido');
      expect(jwt.verify).not.toHaveBeenCalled();
    });

    it('Debería lanzar un error si jwt.verify falla', async () => {
      // Arrange
      const token = 'Bearer validToken123';
      const errorMessage = 'Token verification failed';
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error(errorMessage);
      });

      // Act & Assert
      await expect(securityService.getClaims(token)).rejects.toThrow('Token inválido');
      expect(jwt.verify).toHaveBeenCalledWith('validToken123', 'secret');
    });
  });
});
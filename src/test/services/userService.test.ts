import { userService } from '../../services';
import { UserModel, UserDocument, UserInput } from '../../models';

jest.mock('../../models', () => ({
  UserModel: {
    create: jest.fn(),
    findOneAndDelete: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findOneAndUpdate: jest.fn()
  },
  UserDocument: {},
  UserInput: {}
}));

describe('User Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    _id: 'user_id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed_password',
    role: 'customer'
  };

  it('debería crear un usuario correctamente', async () => {
    (UserModel.create as jest.Mock).mockResolvedValue(mockUser);
    
    const result = await userService.create(mockUser as UserDocument);
    
    expect(UserModel.create).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('debería manejar errores al crear un usuario', async () => {
    const error = new Error('Error al crear usuario');
    (UserModel.create as jest.Mock).mockRejectedValue(error);
    
    await expect(userService.create(mockUser as UserDocument)).rejects.toThrow(error);
  });

  it('debería eliminar un usuario correctamente', async () => {
    (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(mockUser);
    
    const result = await userService.delete('test@example.com');
    
    expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toEqual(mockUser);
  });

  it('debería encontrar un usuario por email', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    
    const result = await userService.findByEmail('test@example.com');
    
    expect(UserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(result).toEqual(mockUser);
  });

  it('debería obtener todos los usuarios', async () => {
    (UserModel.find as jest.Mock).mockResolvedValue([mockUser]);
    
    const result = await userService.getAll();
    
    expect(UserModel.find).toHaveBeenCalled();
    expect(result).toEqual([mockUser]);
  });

  it('debería actualizar un usuario correctamente', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name', password: '' };
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedUser);
    
    const result = await userService.update('test@example.com', mockUser as UserInput);
    
    expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(
      { email: 'test@example.com' }, 
      mockUser, 
      { returnOriginal: false }
    );
    expect(result).toEqual(updatedUser);
  });

  it('debería manejar error al eliminar un usuario que no existe', async () => {
    (UserModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);
    
    const result = await userService.delete('nonexistent@example.com');
    expect(result).toBeNull();
  });

  it('debería manejar error al buscar un usuario por email inexistente', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);
    
    const result = await userService.findByEmail('nonexistent@example.com');
    expect(result).toBeNull();
  });

  it('debería manejar error al actualizar un usuario inexistente', async () => {
    (UserModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
    
    const result = await userService.update('nonexistent@example.com', mockUser as UserInput);
    expect(result).toBeNull();
  });
});
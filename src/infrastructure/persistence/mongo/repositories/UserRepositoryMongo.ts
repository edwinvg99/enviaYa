import { UserModel } from '../../data/mock/models/UserModel';
import { IUser } from '../../../../domain/users/entities/User';

export class UserRepositoryMongo {
  // Buscar usuario por email (usado para login o registro)
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await UserModel.findOne({ email }).lean(); // lean() devuelve un objeto plano
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw new Error('Error al buscar el usuario en la base de datos');
    }
  }

  // Registrar un nuevo usuario
  async create(userData: IUser): Promise<IUser> {
    try {
      const user = new UserModel(userData);
      const savedUser = await user.save();
      return savedUser.toObject() as unknown as IUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('No se pudo crear el usuario');
    }
  }
}






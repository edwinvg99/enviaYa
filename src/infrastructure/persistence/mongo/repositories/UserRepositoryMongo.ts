import { UserModel } from '../../data/models/UserModel';
import { IUser } from '../../../../domain/users/entities/User';

export class UserRepositoryMongo {
  async findById(id: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findById(id).lean();
      if (!user) return null;
      
      return {
        ...user,
        _id: user._id.toString()
      } as IUser;
    } catch (error) {
      console.error('Error en findById:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await UserModel.findOne({ email }).lean();
      if (!user) return null;
      
      return {
        ...user,
        _id: user._id.toString()
      } as IUser;
    } catch (error) {
      console.error('Error en findByEmail:', error);
      throw new Error('Error al buscar el usuario en la base de datos');
    }
  }

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






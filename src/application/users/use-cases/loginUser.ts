import { UserRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/UserRepositoryMongo';
import { IUser } from '../../../domain/users/entities/User';

interface LoginDTO {
  email: string;
  password: string;
}

export class LoginUser {
  private userRepository: UserRepositoryMongo;

  constructor() {
    this.userRepository = new UserRepositoryMongo();
  }

  async execute({ email, password }: LoginDTO): Promise<IUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // Comparar contraseñas directamente (más adelante puedes usar bcrypt)
    if (user.password !== password) {
      throw new Error('Contraseña incorrecta');
    }

    return user; // Devuelve los datos del usuario autenticado
  }
}

import { UserRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/UserRepositoryMongo';
import { IUser } from '../entities/User';

export class RegisterUserService {
  private userRepository: UserRepositoryMongo;

  constructor() {
    this.userRepository = new UserRepositoryMongo();
  }

  async execute(userData: IUser): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('El usuario ya existe');
    }

    return await this.userRepository.create(userData);
  }
}


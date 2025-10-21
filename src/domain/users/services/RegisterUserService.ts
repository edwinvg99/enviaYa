import { UserRepositoryMongo } from '../../../infrastructure/persistence/mongo/repositories/UserRepositoryMongo';
import { IUser } from '../entities/User';
import { generateVerificationToken } from '../../../domain/shared/utils/TokenGenerator';
import { SendGridEmailService } from '../../../infrastructure/email/SendGridEmailService';

export class RegisterUserService {
  private userRepository: UserRepositoryMongo;
  private emailService: SendGridEmailService;

  constructor() {
    this.userRepository = new UserRepositoryMongo();
    this.emailService = new SendGridEmailService();
  }

  async execute(userData: IUser): Promise<IUser> {
    const existing = await this.userRepository.findByEmail(userData.email);
    if (existing) {
      throw new Error('El usuario ya existe');
    }

    // 🔐 Generar token de verificación
    const verificationToken = generateVerificationToken();

    // Crear usuario con verificación pendiente
    const newUser = await this.userRepository.create({
      ...userData,
      isVerified: false,
      verificationToken,
    });

    // 📩 Enviar correo de verificación
    await this.emailService.sendVerificationEmail(
      newUser.email,
      newUser.name,
      verificationToken
    );

    return newUser;
  }
}



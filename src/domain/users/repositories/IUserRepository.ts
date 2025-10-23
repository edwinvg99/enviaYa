
import { IUser } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
  confirmEmail(email: string): Promise<void>;
  updateLoginAttempts(email: string, attempts: number): Promise<void>;
  lockUser(email: string): Promise<void>;
}


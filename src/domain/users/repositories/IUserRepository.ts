// Puerto (Interface) del repositorio de usuarios
/*import { User } from '../entities/User';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
}*/

// src/domain/repositories/UserRepository.ts
import { IUser } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  save(user: IUser): Promise<IUser>;
  confirmEmail(email: string): Promise<void>;
  updateLoginAttempts(email: string, attempts: number): Promise<void>;
  lockUser(email: string): Promise<void>;
}


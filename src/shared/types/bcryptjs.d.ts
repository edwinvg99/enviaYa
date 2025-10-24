declare module 'bcryptjs' {
  const bcrypt: any;
  export default bcrypt;
}

declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      email: string;
      role: 'USER' | 'ADMIN' | 'VENDOR';
    };
  }
}

export {};

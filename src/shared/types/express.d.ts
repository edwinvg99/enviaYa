declare global {
  namespace Express {
    interface Request {
      user?: {
        _id?: string;
        id?: string;
        role: 'USER' | 'ADMIN' | 'VENDOR';
        email?: string;
        name?: string;
      };
    }
  }
}

export {};

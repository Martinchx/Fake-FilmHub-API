import jwt from 'jsonwebtoken';

import { envs } from '../..';

export class JWTAdapter {
  static async generateToken(payload: Record<string, any>, duration: string = '20d'): Promise<string | null> {
    return new Promise((resolve) => {
      jwt.sign(payload, envs.JWT_SECRET, { expiresIn: duration }, (err, token) => {
        if (err) return resolve(null);
        resolve(token!);
      });
    });
  }

  static async validateToken<T>(token: string): Promise<T | null> {
    return new Promise((resolve) => {
      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {
        if (err) return resolve(null);
        resolve(decoded as T);
      });
    });
  }

  static async decodeToken<T>(token: string): Promise<T> {
    return new Promise((resolve) => {
      const decoded = jwt.decode(token) as T;
      resolve(decoded);
    });
  }
}

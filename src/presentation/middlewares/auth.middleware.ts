import { NextFunction, Request, Response } from 'express';

import { JWTAdapter, prisma } from '../../infrastructure';

export class AuthMiddleware {
  static validateJWT = async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.header('Authorization');

    if (!authorization) return res.status(401).json({ error: 'No token provided' });
    if (!authorization.startsWith('Bearer')) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';

    try {
      const payload = await JWTAdapter.validateToken<{ user_id: number }>(token);
      if (!payload) return res.status(401).json({ error: 'Invalid token' });

      const user = await prisma.userModel.findUnique({ where: { user_id: payload.user_id } });
      if (!user) return res.status(401).json({ error: 'Invalid token - User not found' });

      req.body.user = user;

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

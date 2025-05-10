import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.headers['access_token'] as string;

    if (!accessToken) {
      return res.status(400).json({ error: 'Access token is required' });
    }

    const user = await User.findById(accessToken);
    if (!user) {
      return res.status(400).json({ error: 'Invalid access token' });
    }

    // Attach user to request object for downstream use
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

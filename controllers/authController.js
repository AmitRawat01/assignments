import jwt from 'jsonwebtoken';
import passport from 'passport';
import { jwtSecret } from '../config/keys';

export const login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Login failed' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    return res.json({ token });
  })(req, res);
};

export const register = (req, res) => {
  // Registration logic here
};

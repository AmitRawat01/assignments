const jwt = require('jsonwebtoken');
const passport = require('passport');
const { jwtSecret } = require('../config/keys');

exports.login = (req, res) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Login failed' });
    }
    const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    return res.json({ token });
  })(req, res);
};

exports.register = (req, res) => {
  // Registration logic here
};

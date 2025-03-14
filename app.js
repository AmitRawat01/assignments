import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import './config/passport';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

import routes from './routes';
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

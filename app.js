const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
require('./config/passport');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(session({ secret: 'yourSecretKey', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/api', require('./routes'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

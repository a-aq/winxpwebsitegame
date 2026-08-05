const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(express.static('public'));

app.use(session({
  secret: 'your-secure-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'strict' }
}));

const db = { users: new Map() };

function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.post('/api/game/click', requireAuth, (req, res) => {
  const user = db.users.get(req.session.user) || { score: 0 };
  user.score += 1;
  db.users.set(req.session.user, user);
  res.json({ success: true, score: user.score });
});

app.listen(PORT, () => {
  console.log(`Secure backend server running on port ${PORT}`);
});
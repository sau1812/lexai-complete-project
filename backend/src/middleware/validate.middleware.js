/**
 * Validation middleware for request body fields
 */

const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters.' });
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  req.body.name = name.trim();
  req.body.email = email.toLowerCase().trim();
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required.' });
  }

  req.body.email = email.toLowerCase().trim();
  next();
};

module.exports = { validateRegister, validateLogin };

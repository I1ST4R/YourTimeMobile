import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = 'adofjdvjoisjfkwi1230897mz';

export const generateToken = (userId, login) => {
  return jwt.sign({ userId, login }, JWT_SECRET, { expiresIn: '15m' });
};

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Токен отсутствует' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: 'Невалидный токен' });
      return;
    }
    
    req.user = decoded;
    next();
  });
};

export const hashPassword = async (req, res, next) => {
  if (req.body.password) {
    const saltRounds = 10;
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }
  next();
};

export const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
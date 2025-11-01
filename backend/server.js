import jsonServer from 'json-server';
import { authenticateToken, comparePassword, generateToken, hashPassword } from './authMiddleware.js';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Эндпоинт для сохранения зашифрованных данных пользователя
server.put('/user/data', authenticateToken, (req, res) => {
  const db = router.db;
  const userId = req.user.userId;
  const { data } = req.body;

  if (!data) {
    return res.status(400).json({ error: 'Data field is required' });
  }

  try {
    const users = db.get('users');
    const user = users.find({ id: userId }).value();
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Обновляем данные пользователя
    users.find({ id: userId }).assign({ encryptedData: data }).write();

    res.json({ 
      success: true, 
      message: 'Данные успешно сохранены' 
    });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Ошибка при сохранении данных' });
  }
});

// Эндпоинт для получения зашифрованных данных пользователя
server.get('/user/data', authenticateToken, (req, res) => {
  const db = router.db;
  const userId = req.user.userId;

  try {
    const user = db.get('users').find({ id: userId }).value();
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Возвращаем зашифрованные данные (может быть null/undefined если данных нет)
    res.json({ 
      data: user.encryptedData || null 
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Ошибка при получении данных' });
  }
});

// Эндпоинт для удаления данных пользователя
server.delete('/user/data', authenticateToken, (req, res) => {
  const db = router.db;
  const userId = req.user.userId;

  try {
    const users = db.get('users');
    const user = users.find({ id: userId }).value();
    
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Удаляем данные пользователя
    users.find({ id: userId }).assign({ encryptedData: null }).write();

    res.json({ 
      success: true, 
      message: 'Данные успешно удалены' 
    });
  } catch (error) {
    console.error('Error deleting user data:', error);
    res.status(500).json({ error: 'Ошибка при удалении данных' });
  }
});

server.post('/auth/register', hashPassword, (req, res) => {
  const db = router.db;
  const existingUser = db.get('users').find({ login: req.body.login }).value();
  
  if (existingUser) {
    return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
  }
  
  const newUser = {
    id: Date.now(),
    login: req.body.login,
    password: req.body.password,
    encryptedData: null // Добавляем поле для зашифрованных данных
  };
  
  db.get('users').push(newUser).write();
  
  const token = generateToken(newUser.id, newUser.login);
  
  res.json({
    user: {
      id: newUser.id,
      login: newUser.login
    },
    token
  });
});

server.post('/auth/login', async (req, res) => {
  const { login, password } = req.body;
  const db = router.db;
  
  const user = db.get('users').find({ login }).value();
  
  if (!user) {
    return res.status(401).json({ error: 'Пользователь не найден' });
  }
  
  const isValidPassword = await comparePassword(password, user.password);
  
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  
  const token = generateToken(user.id, user.login);
  
  res.json({
    user: {
      id: user.id,
      login: user.login
    },
    token
  });
});

server.get('/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

server.get('/users/me', authenticateToken, (req, res) => {
  const db = router.db;
  const user = db.get('users').find({ id: req.user.userId }).value();
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

server.use('/intervals', authenticateToken);
server.use('/users', authenticateToken);

server.use(router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
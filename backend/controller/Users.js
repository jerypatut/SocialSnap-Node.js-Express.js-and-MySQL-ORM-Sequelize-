const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const redisClient = require('../redisClient'); // Pastikan file redisClient.js sudah dikonfigurasi

// Registrasi user
const UsersRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    await Users.create({ username, password: hash });
    return res.status(201).json({ message: 'SUCCESS' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Login user dan simpan data user di Redis sebagai cache
const UserLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "User Doesn't Exist" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ error: 'Wrong Username And Password Combination' });
    }

    // Buat token JWT
    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      'importantsecret',
    );

    // Simpan data user ke Redis dengan key berdasarkan token
    // Set TTL (misalnya 3600 detik = 1 jam)
    await redisClient.setEx(
      `user:${accessToken}`,
      3600,
      JSON.stringify({
        username: user.username,
        id: user.id,
      }),
    );

    return res.json({
      token: accessToken,
      username: user.username,
      id: user.id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// Mendapatkan data user (cache dari Redis jika tersedia)
const getUser = async (req, res) => {
  // Asumsikan token dikirim via header "accessToken"
  const token = req.header('accessToken');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Cek cache di Redis
    const cachedUser = await redisClient.get(`user:${token}`);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }
    // Jika tidak ada di cache, fallback (misalnya, token sudah diverifikasi dan disimpan di req.user oleh middleware autentikasi)
    return res.json(req.user);
  } catch (error) {
    console.error('Error fetching user from cache:', error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { UsersRegister, UserLogin, getUser };

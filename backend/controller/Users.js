const { Users } = require('../models');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcrypt');

const UsersRegister = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await Users.create({ username, password: hash });
    return res.status(201).json({ message: 'SUCCESS' });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: error.message });
  }
};

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

    const accessToken = jwt.sign(
      { username: user.username, id: user.id },
      'importantsecret',
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
const getUser = (req, res) => {
  res.json(req.user);
};
module.exports = { UsersRegister, UserLogin, getUser };

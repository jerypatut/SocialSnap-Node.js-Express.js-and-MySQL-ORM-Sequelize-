const express = require('express');
const cors = require('cors');
const compression = require('compression');

const app = express();
const likesRouter = require('./routes/Likes');
const commentsRouter = require('./routes/Comments');
const postRouter = require('./routes/Posts');
const usersRouter = require('./routes/Users');
const db = require('./models');

// Middleware
app.use(compression());
app.use(cors());
app.use('/assets', express.static('assets'));
app.use(express.json());

// Routes
app.use('/auth', usersRouter);
app.use('/posts', postRouter);
app.use('/comments', commentsRouter);
app.use('/likes', likesRouter);

// Optional: Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Database Sync & Start Server
db.sequelize
  .sync()
  .then(() => {
    app.listen(3001, () => {
      console.log(`Server running on http://localhost:3001`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
  });

module.exports = app;

require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'MERN midterm API is running' }));
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

app.use((req, res) => res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} not found` }));
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
});

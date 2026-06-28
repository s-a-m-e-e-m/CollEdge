const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(cors({
    // origin: "http://localhost:5173",
    origin: "https://tasktracker-three-bay.vercel.app",
    credentials: true,
}));

dotenv.config();

app.use(express.json());
app.use(cookieParser());

const userRoutes = require('./routes/user.route.js');
const taskRoutes = require('./routes/task.route.js');

app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);

module.exports = app;
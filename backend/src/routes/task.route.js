const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/middleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/task.controller.js');

router.post('/create', authMiddleware, createTask);
router.get('/get', authMiddleware, getTasks);
router.put('/update/:taskId', authMiddleware, updateTask);
router.delete('/delete/:taskId', authMiddleware, deleteTask);

module.exports = router;
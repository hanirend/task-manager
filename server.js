const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const { register, login } = require('./auth');

// Auth routes
app.post('/register', register);
app.post('/login', login);

// GET /tasks - List all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    logger.error('Failed to fetch tasks', { error });
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST /tasks - Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Task name is required' });
    }
    const task = await prisma.task.create({
      data: { name }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id/done - Mark task as done
app.put('/tasks/:id/done', async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { done: true }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

const cors = require('cors');
app.use(cors());
app.use(express.json());

const { register, login } = require('./auth');

// Auth routes
app.post('/register', register);
app.post('/login', login);

// GET /tasks – List all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
});

// POST /tasks – Add a new task
app.post('/tasks', async (req, res) => {
    const { name } = req.body;
    const task = await prisma.task.create({
        data: { name }
    });
    res.status(201).json(task);
});

// PUT /tasks/:id/done – Mark task as done
app.put('/tasks/:id/done', async (req, res) => {
    const { id } = req.params;
    const task = await prisma.task.update({
        where: { id: parseInt(id) },
        data: { done: true }
    });
    res.json(task);
});

// DELETE /tasks/:id – Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.task.delete({
        where: { id: parseInt(id) }
    });
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const request = require('supertest');
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

test('GET /tasks returns an array', async () => {
  const response = await request(app).get('/tasks');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
}, 30000);
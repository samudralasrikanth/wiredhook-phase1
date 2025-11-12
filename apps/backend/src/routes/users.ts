import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

let users = [
  { id: uuidv4(), name: 'John Doe' },
  { id: uuidv4(), name: 'Jane Doe' },
];

router.get('/users', (_req, res) => {
  res.json(users);
});

router.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  const newUser = { id: uuidv4(), name };
  users.push(newUser);
  res.status(201).json(newUser);
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  if (users.length === initialLength) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

export default router;

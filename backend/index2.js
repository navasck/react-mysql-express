import express from 'express';
import knex from 'knex';
import cors from 'cors';
import dotenv from 'dotenv';
import Joi from 'joi';
// joi - The most powerful schema description language and data validator for JavaScript.

// Knex.js -  SQL query builder for PostgreSQL, CockroachDB, MSSQL, MySQL, MariaDB, SQLite3, Better-SQLite3, Oracle, and Amazon Redshift designed to be flexible, portable, and fun to use.

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize knex
const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

app.get('/', (req, res) => {
  res.json('hello');
});

app.get('/books', async (req, res, next) => {
  try {
    const books = await db.select('*').from('bookstwo');
    res.json(books);
  } catch (err) {
    next(err);
  }
});

app.post('/books', async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    cover: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const [id] = await db('bookstwo').insert(value);
    res.json({ id, ...value });
  } catch (err) {
    next(err);
  }
});

app.get('/books/:id', async (req, res, next) => {
  const bookId = req.params.id;

  try {
    const book = await db('bookstwo').where({ id: bookId }).first();
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
});

app.delete('/books/:id', async (req, res, next) => {
  const bookId = req.params.id;

  try {
    const rowsAffected = await db('bookstwo').where({ id: bookId }).del();
    if (rowsAffected === 0)
      return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
});

app.put('/books/:id', async (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    price: Joi.number().required(),
    cover: Joi.string().required(),
  });

  const { error, value } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const bookId = req.params.id;

  try {
    const rowsAffected = await db('bookstwo')
      .where({ id: bookId })
      .update(value);
    if (rowsAffected === 0)
      return res.status(404).json({ message: 'Book not found' });
    res.json({ message: 'Book updated successfully' });
  } catch (err) {
    next(err);
  }
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(8800, () => {
  console.log('Connected to backend.');
});

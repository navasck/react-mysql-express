import express from "express";
import mysql from "mysql2";
import cors from "cors";
import knex from 'knex';

const app = express();
app.use(cors());
app.use(express.json());

//  initializes a MySQL database connection using the mysql.createConnection method.

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'bookapp',
});

// Initialize knex
// const db = knex({
//   client: 'mysql2',
//   connection: {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   },
// });

app.get("/", (req, res) => {
  res.json("hello");
});

app.get("/books", (req, res) => {
  // SQL query string
  const q = 'SELECT * FROM bookstwo';
  db.query(q, (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.post("/books", (req, res) => {
  const q =
    'INSERT INTO bookstwo(`title`, `desc`, `price`, `cover`) VALUES (?)';

  if (!req.body.title || !req.body.desc || !req.body.price || !req.body.cover) {
    res.status(400);
    throw new Error('Please fill all text fields');
  }

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  // The db.query function is called to execute the SQL query. It takes three arguments: the query string (q), an array of values ([values]), and a callback function.

  db.query(q, [values], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const q = 'SELECT * FROM bookstwo WHERE id = ?';

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.log(err);
      return res.json(err);
    }
    if (data.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    return res.json(data[0]);
  });
});

app.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  const q = ' DELETE FROM bookstwo WHERE id = ? ';

  db.query(q, [bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.put("/books/:id", (req, res) => {
  const bookId = req.params.id;

  //The SQL query string is defined to update the corresponding record in the "bookstwo" table using the provided values. The ? placeholders in the query will be replaced with actual values during query execution.

  const q =
    'UPDATE bookstwo SET `title`= ?, `desc`= ?, `price`= ?, `cover`= ? WHERE id = ?';

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  db.query(q, [...values, bookId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.listen(8800, () => {
  console.log("Connected to backend.");
});



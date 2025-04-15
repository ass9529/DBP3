console.log("🚀 Starting server setup...");

const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./db');
require('dotenv').config();

console.log("📦 Dependencies loaded.");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

console.log("🛠️ Middleware configured.");



// Home
app.get('/', (req, res) => {
  console.log("➡️ GET /");
  res.render('index');
});

// Search
app.get('/search-form', (req, res) => {
  console.log("➡️ GET /search-form");
  res.render('search', { results: null, message: null });
});

app.post('/search', (req, res) => {
  const { query } = req.body;
  console.log("📨 POST /search", query);
  const sql = `SELECT * FROM VIEWER WHERE Name LIKE ? OR ViewerId = ?`;
  connection.query(sql, [`%${query}%`, query], (err, results) => {
    if (err) {
      console.error("❌ Search failed:", err.message);
      return res.render('search', { results: null, message: '❌ Search failed.' });
    }
    res.render('search', { results, message: null });
  });
});

// Insert
app.get('/insert-form', (req, res) => {
  console.log("➡️ GET /insert-form");
  res.render('insert', { message: null });
});

app.post('/insert', (req, res) => {
  const { ViewerId, Name, Sex, MailId, Age, City, StateAb } = req.body;
  console.log("📨 POST /insert", req.body);
  const sql = `INSERT INTO VIEWER VALUES (?, ?, ?, ?, ?, ?, ?)`;
  connection.query(sql, [ViewerId, Name, Sex, MailId, Age, City, StateAb], (err) => {
    if (err) {
      console.error("❌ Insertion failed:", err.message);
      return res.render('insert', { message: '❌ Insertion failed. Viewer ID might already exist.' });
    }
    res.render('insert', { message: '✅ Viewer inserted successfully!' });
  });
});

// Update
app.get('/update-form', (req, res) => {
  console.log("➡️ GET /update-form");
  res.render('update', { message: null });
});

app.post('/update', (req, res) => {
  const { ViewerId, NewName } = req.body;
  console.log("📨 POST /update", req.body);
  const sql = `UPDATE VIEWER SET Name = ? WHERE ViewerId = ?`;
  connection.query(sql, [NewName, ViewerId], (err, result) => {
    if (err) {
      console.error("❌ Update failed:", err.message);
      return res.render('update', { message: '❌ Update failed.' });
    }
    if (result.affectedRows === 0) return res.render('update', { message: '⚠️ Viewer not found.' });
    res.render('update', { message: '✅ Viewer updated successfully!' });
  });
});

// Delete
app.get('/delete-form', (req, res) => {
  console.log("➡️ GET /delete-form");
  res.render('delete', { message: null });
});

app.post('/delete', (req, res) => {
  const { query } = req.body;
  console.log("📨 POST /delete", query);

  let sql, values;
  if (!isNaN(query)) {
    sql = `DELETE FROM VIEWER WHERE ViewerId = ?`;
    values = [parseInt(query)];
  } else {
    sql = `DELETE FROM VIEWER WHERE Name = ?`;
    values = [query];
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Deletion failed:", err.message);
      return res.render('delete', { message: '❌ Deletion failed.' });
    }

    if (result.affectedRows === 0) {
      res.render('delete', { message: '⚠️ No viewer found to delete.' });
    } else {
      res.render('delete', { message: '✅ Viewer deleted successfully!' });
    }
  });
});

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});


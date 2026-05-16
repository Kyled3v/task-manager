const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./tasks.db");

// Create table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT
  )`);
});

// Test route
app.get("/", (req, res) => {
  res.send("Task Manager Backend Running");
});

// Create task
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  db.run("INSERT INTO tasks (title) VALUES (?)", [title], function () {
    res.json({ id: this.lastID, title });
  });
});

// Get tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    res.json(rows);
  });
});

// Delete task
app.delete("/tasks/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", [req.params.id], () => {
    res.json({ message: "Deleted" });
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running");
});
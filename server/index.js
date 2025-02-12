const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all users
app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Create a new user
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    db.query("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ id: result.insertId, name, email });
    });
});

// Update user
app.put("/users/:id", (req, res) => {
    const { name, email } = req.body;
    db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User updated successfully" });
    });
});

// Delete user
app.delete("/users/:id", (req, res) => {
    db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "User deleted successfully" });
    });
});


// Start server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});

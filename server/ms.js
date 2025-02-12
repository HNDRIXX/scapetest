import express from "express";
import sql from "mssql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Microsoft SQL Server Connection Config
const dbConfig = {
    user: "your_db_user",
    password: "your_db_password",
    server: "localhost",
    database: "your_database_name",
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Windows Auth Config
// const dbConfig = {
//     server: "localhost", // Change to your SQL Server name or IP
//     database: "YourDatabaseName",
//     options: {
//         trustedConnection: true, // Enables Windows Authentication
//         encrypt: false,          // Set to true if using Azure SQL
//         trustServerCertificate: true, // Needed for self-signed certificates
//     },
// };

// Connect to MSSQL database
sql.connect(dbConfig)
    .then(() => console.log("Connected to MSSQL Database"))
    .catch(err => console.error("Database Connection Failed", err));

// Get all users
app.get("/users", async (req, res) => {
    try {
        const result = await sql.query("SELECT * FROM Users");
        res.json(result.recordset);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Database error" });
    }
});

// Add a new user
app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    try {
        await sql.query(`INSERT INTO Users (name, email) VALUES ('${name}', '${email}')`);
        res.json({ message: "User added successfully" });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Error adding user" });
    }
});

// Update user
app.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        await sql.query(`UPDATE Users SET name = '${name}', email = '${email}' WHERE id = ${id}`);
        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Error updating user" });
    }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        // Confirm deletion
        const result = await sql.query(`DELETE FROM Users WHERE id = ${id}`);
        if (result.rowsAffected[0] > 0) {
            res.json({ message: "User deleted successfully" });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Error deleting user" });
    }
});

// Start server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

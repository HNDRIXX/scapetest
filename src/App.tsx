import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [editingUserId, setEditingUserId] = useState(null); // Track user being edited

    // Fetch users from backend on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get("http://localhost:5000/users")
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    };

    // Handle form submission (Create or Update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingUserId) {
            // Update user
            axios.put(`http://localhost:5000/users/${editingUserId}`, { name, email })
                .then(() => {
                    fetchUsers();
                    setName("");
                    setEmail("");
                    setEditingUserId(null); // Reset edit state
                })
                .catch(error => console.error(error));
        } else {
            // Create new user
            axios.post("http://localhost:5000/users", { name, email })
                .then(() => {
                    fetchUsers();
                    setName("");
                    setEmail("");
                })
                .catch(error => console.error(error));
        }
    };

    // Edit user
    const handleEdit = (user) => {
        setEditingUserId(user.id);
        setName(user.name);
        setEmail(user.email);
    };

    // Delete user
    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (confirmDelete) {
            axios.delete(`http://localhost:5000/users/${id}`)
                .then(() => fetchUsers())
                .catch(error => console.error(error));
        }
    };

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                        <button onClick={() => handleEdit(user)}>Edit</button>
                        <button onClick={() => handleDelete(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            <h2>{editingUserId ? "Edit User" : "Add User"}</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                />
                <button type="submit">{editingUserId ? "Update" : "Add"} User</button>
            </form>
        </div>
    );
};

export default App;

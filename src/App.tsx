import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        axios.get("http://localhost:5000/users")
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }, []);

    const addUser = () => {
        axios.post("http://localhost:5000/users", { name, email })
            .then(response => {
                setUsers([...users, { id: response.data.id, name, email }]);
                setName("");
                setEmail("");
            })
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} ({user.email})</li>
                ))}
            </ul>
            <h2>Add User</h2>
            <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
            <button onClick={addUser}>Add</button>
        </div>
    );
};

export default App;

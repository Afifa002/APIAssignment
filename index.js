// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory array to store users
let users = [
    { id: '1', firstName: 'Anshika', lastName: 'Agarwal', hobby: 'Teaching' }
];

// Middleware for logging
app.use((req, res, next) => {
    console.log(`Request Method: ${req.method}, URL: ${req.url}`);
    next();
});

// Middleware for validation
function validateUser(req, res, next) {
    const { firstName, lastName, hobby } = req.body;
    if (!firstName || !lastName || !hobby) {
        return res.status(400).json({ error: "firstName, lastName, and hobby are required" });
    }
    next();
}

// Routes

// GET /users - Fetch all users
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// GET /users/:id - Fetch a specific user by ID
app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
});

// POST /user - Add a new user
app.post('/user', validateUser, (req, res) => {
    const newUser = { id: `${users.length + 1}`, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /user/:id - Update an existing user
app.put('/user/:id', validateUser, (req, res) => {
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.hobby = req.body.hobby;
    
    res.status(200).json(user);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// DELETE /user/:id - Delete a user
app.delete('/user/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
    
    users.splice(userIndex, 1);
    res.status(200).json({ message: 'User deleted successfully' });
});

// Error handling middleware for unknown routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

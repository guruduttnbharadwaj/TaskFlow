const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const SECRET_KEY = "intern_task_secret_key"; 

app.use(cors());
app.use(express.json());

// --- DATABASE SIMULATION (File System) ---
// This acts exactly like MongoDB but saves to a local file
const DB_FILE = './database.json';

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], tasks: [] }));
}

const readDB = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE));
    } catch (e) {
        return { users: [], tasks: [] };
    }
};
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// --- AUTH ROUTES ---

// 1. Register
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    if (db.users.find(u => u.username === username)) {
        return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // Create User ID
    const newUser = { id: Date.now().toString(), username, password: hashedPassword, joinedAt: new Date() };
    db.users.push(newUser);
    writeDB(db);

    res.json({ success: true, message: "User registered successfully!" });
});

// 2. Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const db = readDB();

    const user = db.users.find(u => u.username === username);
    if (!user) return res.status(400).json({ error: "User not found" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ success: true, token, username: user.username });
});

// --- MIDDLEWARE ---
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// --- PROFILE ROUTES ---

// 3. Get User Profile
app.get('/api/profile', authenticate, (req, res) => {
    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Return safe info
    res.json({ 
        username: user.username, 
        id: user.id, 
        joinedAt: user.joinedAt 
    });
});

// --- TASK ROUTES ---

// 4. Get Tasks
app.get('/api/tasks', authenticate, (req, res) => {
    const db = readDB();
    const userTasks = db.tasks.filter(t => t.userId === req.user.id);
    res.json(userTasks);
});

// 5. Add Task
app.post('/api/tasks', authenticate, (req, res) => {
    const db = readDB();
    const newTask = {
        _id: Date.now().toString(), // Simulating MongoDB _id
        userId: req.user.id,
        text: req.body.text,
        completed: false,
        createdAt: new Date()
    };
    db.tasks.push(newTask);
    writeDB(db);
    res.json(newTask);
});

// 6. Update Task (Toggle Complete)
app.put('/api/tasks/:id', authenticate, (req, res) => {
    const db = readDB();
    const taskId = req.params.id;
    const taskIndex = db.tasks.findIndex(t => t._id === taskId);

    if (taskIndex === -1) return res.status(404).json({ error: "Task not found" });
    
    // Verify ownership
    if (db.tasks[taskIndex].userId !== req.user.id) return res.status(403).json({ error: "Not authorized" });

    // Update
    const { completed, text } = req.body;
    if (completed !== undefined) db.tasks[taskIndex].completed = completed;
    if (text !== undefined) db.tasks[taskIndex].text = text;

    writeDB(db);
    res.json(db.tasks[taskIndex]);
});

// 7. Delete Task
app.delete('/api/tasks/:id', authenticate, (req, res) => {
    const db = readDB();
    const taskId = req.params.id;
    
    const initialLength = db.tasks.length;
    // Remove task if it belongs to user
    db.tasks = db.tasks.filter(t => !(t._id === taskId && t.userId === req.user.id));
    
    if (db.tasks.length === initialLength) return res.status(404).json({ error: "Task not found" });

    writeDB(db);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log("---------------------------------------");
    console.log(`Backend running on port ${port}`);
    console.log("   USING LOCAL FILE DATABASE (JSON)    ");
    console.log("   (No MongoDB required)               ");
    console.log("---------------------------------------");
});
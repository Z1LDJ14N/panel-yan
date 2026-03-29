'use strict';

const express = require('express');
const multer = require('multer');
const { Server } = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware for parsing application/json
app.use(express.json());

// Middleware for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint for file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    // Handle the file upload (e.g., save it to a cloud storage)
    console.log('File uploaded:', req.file.originalname);
    res.send('File uploaded successfully.');
});

// Endpoint to control the bot
app.post('/control-bot', (req, res) => {
    const { action } = req.body;
    if (!action) {
        return res.status(400).send('Action is required.');
    }
    console.log(`Bot action received: ${action}`);
    // Implement bot control logic here
    res.send(`Bot action ${action} executed.`);
});

// Real-time logs
io.on('connection', (socket) => {
    console.log('New client connected');
    // Emit log messages to the client
    socket.emit('log', 'Connection established');

    // You could listen for log messages from the server and emit them to clients
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

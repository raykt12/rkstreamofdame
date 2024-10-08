const express = require('express');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

// Endpoint to handle file upload
app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ videoPath: `/uploads/${req.file.filename}` });
});

// Serve video files
app.use('/uploads', express.static('uploads'));

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('play', () => {
        socket.broadcast.emit('play');
    });

    socket.on('pause', () => {
        socket.broadcast.emit('pause');
    });

    socket.on('timeUpdate', (time) => {
        socket.broadcast.emit('timeUpdate', time);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

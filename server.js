const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.use((req,res)=>{
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

let users = [];

io.on('connection', (socket) => {
    console.log('A user connected.');
    socket.on('find partner', (nickname) => {
        console.log(`${nickname} is looking for a partner.`);
        if (users.length < 1) {
            users.push({ socket: socket, nickname: nickname });
        } else {
            const partner = users.pop();
            socket.emit('partner found', { nickname: partner.nickname });
            partner.socket.emit('partner found', { nickname: nickname });

            const handleChatMessage = (msg) => {
                partner.socket.emit('chat message', { nickname, msg });
            };

            const handlePartnerMessage = (msg) => {
                socket.emit('chat message', { nickname: partner.nickname, msg });
            };

            socket.on('chat message', handleChatMessage);
            partner.socket.on('chat message', handlePartnerMessage);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
        users = users.filter(user => user.socket !== socket);
    });
});

let activeUsersCount=0;

io.on('connection', (socket) => {
    console.log('A user connected.');
    activeUsersCount++;
    io.emit('updateUserCount', activeUsersCount); // Отправляем обновленное количество пользователей всем клиентам

    socket.on('disconnect', () => {
        activeUsersCount--;
        console.log('A user disconnected.');
        io.emit('updateUserCount', activeUsersCount); // Отправляем обновленное количество пользователей всем клиентам
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
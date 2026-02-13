const { WebcastPushConnection } = require('tiktok-live-connector');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const tiktokUsername = process.env.TIKTOK_USER;

if (!tiktokUsername) {
    console.log("Defina TIKTOK_USER nas variáveis!");
    process.exit(1);
}

const tiktokLive = new WebcastPushConnection(tiktokUsername);

tiktokLive.connect().then(() => {
    console.log("Conectado!");
}).catch(err => console.error(err));

tiktokLive.on('gift', data => {
    if (data.giftType === 1 && !data.repeatEnd) return;

    io.emit('gift', {
        username: data.nickname,
        giftName: data.giftName,
        repeatCount: data.repeatCount
    });
});

app.use(express.static('public'));

server.listen(PORT, () => {
    console.log("Servidor rodando...");
});

const express = require('express');
const { WebSocketServer } = require('ws');

const app = express();
const PORT = 3000;

//  HTTP serverı oluştur
const server = app.listen(PORT, () => {
  console.log(`Server is running on httplocalhost${PORT}`);
});

//  WebSocket serverı bağla
const wss = new WebSocketServer({ server });

let count = 0;

//  WebSocket bağlantısı kurulduğunda
wss.on('connection', ws => {
  console.log('New WebSocket connection established.');

//    Mesaj alındığında count'u artır
  ws.on('message', message => {
    if (message.toString() === 'increment') {
      count++;
      console.log(`Count incremented ${count}`);

    //    Yeni count'u tüm client'lara gönder
      wss.clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
          client.send(JSON.stringify({ type: 'count', value: count }));
        }
      });
    }
  });

//    İlk bağlantıda mevcut count'u gönder
  ws.send(JSON.stringify({ type: 'count', value: count }));
});

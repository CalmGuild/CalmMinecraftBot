if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const fs = require('fs');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const mineflayer = require('mineflayer');

const config = {
  host: process.env.SERVER_IP,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  auth: process.env.MICROSOFT_AUTH.toLowerCase() === 'true' ? 'microsoft' : 'mojang',
  version: '1.8',
};

const events = [];
const files = fs.readdirSync(path.join(__dirname, 'events'));

files.forEach((file, i) => {
  if (!file.endsWith('.js')) return;
  const name = file.split('.')[0];
  events.push({ name, execute: require(`./events/${file}`) });
});

let bot;
(function createBot() {
  bot = mineflayer.createBot(config);

  events.forEach((evt, i) => {
    bot.on(evt.name, (...args) => {
      evt.execute(bot, ...args);
    });
  });

  bot.on('end', createBot);
})();

const app = express();

app.use(bodyParser.json());

app.post('/chat', (req, res) => {
  if (req.body.key === process.env.KEY) {
    if (req.body.message) {
      bot.chat(req.body.message);
      res.status(200).json({ success: true, message: 'OK' });
    } else {
      res.status(400).json({ success: false, message: 'Bad Request' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Invalid API Key' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`HTTP listening on port ${process.env.PORT}`);
});

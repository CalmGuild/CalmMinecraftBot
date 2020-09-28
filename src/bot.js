if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const fs = require('fs');
const path = require('path');
const mineflayer = require('mineflayer');

const config = {
  host: process.env.SERVER_IP,
  username: process.env.MC_USERNAME,
  password: process.env.MC_PASSWORD,
  version: '1.8',
};

const events = [];
const files = fs.readdirSync(path.join(__dirname, 'events'));

files.forEach((file, i) => {
  if (!file.endsWith('.js')) return;
  const name = file.split('.')[0];
  events.push({ name, execute: require(`./events/${file}`) });
});

(function createBot() {
  const bot = mineflayer.createBot(config);

  events.forEach((evt, i) => {
    bot.on(evt.name, (...args) => {
      evt.execute(bot, ...args);
    });
  });

  bot.on('end', createBot);
})();

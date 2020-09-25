if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const Discord = require('discord.js');
const mineflayer = require('mineflayer');

const webhookClient = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

const config = {
  host: process.env.SERVER_IP,
  username: process.env.MC_USERNAME,
  version: '1.8'
}
if (process.env.MC_PASSWORD) config.password = process.env.MC_PASSWORD

function createBot() {
  const bot = mineflayer.createBot(config);

  bot.once('spawn', () => {
    console.log('Bot spawned!');
  });

  bot.on('chat', (username, message, translate, jsonMsg, matches) => {
    if(!jsonMsg.extra[0].text.startsWith('§2Guild > ')) return;
  
    const msgarr = message.split(':');

    const embed =  {
      timestamp: new Date(),
      fields: [
        {
          name: "Author",
          value: msgarr.shift()
        },
        {
          name: "Message",
          value: msgarr.join(':')
        }
      ]
    };

    webhookClient.send({ embeds: [embed] });
  });
  
  bot.on('end', createBot);
}

createBot();

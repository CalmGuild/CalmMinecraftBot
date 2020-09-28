const Discord = require('discord.js');

const guildChatLog = new Discord.WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

module.exports = function chat(bot, username, message, translate, jsonMsg, matches) {
  if (!jsonMsg.extra[0].text.startsWith('§2Guild > ')) return;

  const msgarr = message.split(':');

  const embed = {
    timestamp: new Date(),
    fields: [
      {
        name: 'Author',
        value: msgarr.shift(),
      },
      {
        name: 'Message',
        value: msgarr.join(':'),
      },
    ],
  };

  guildChatLog.send({ embeds: [embed] });
};

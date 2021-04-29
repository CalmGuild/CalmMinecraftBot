const { WebhookClient, Util, Message } = require('discord.js');

const guildChatLog = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

module.exports = function chat(bot, username, message, translate, jsonMsg, matches) {
  if (jsonMsg.extra === undefined) return;
  if (!jsonMsg.extra[0].text.startsWith('§2Guild > ')) return;

  const name = getNameFromMessage(message.split(':').shift());
  sendEmbed({
    description: Util.escapeMarkdown(message.split(':')[1]),
    color: '#12a602',
    timestamp: new Date(),
    author: {
      name: Util.escapeMarkdown(message.split(':').shift()),
      icon_url: 'https://mc-heads.net/avatar/' + name,
    },
  });
};

function sendEmbed(embed) {
  guildChatLog.send({ embeds: [embed] }).catch(console.error);
}

function getNameFromMessage(msg) {
  const args = msg.split(' ');
  if (args[0].startsWith('[')) return args[1];
  return args[0];
}
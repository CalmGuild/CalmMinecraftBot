const { WebhookClient, Util, Message } = require('discord.js');

const guildChatLog = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

module.exports = function chat(bot, username, message, translate, jsonMsg, matches) {
  if (jsonMsg.extra === undefined) return;
  if (!jsonMsg.extra[0].text.startsWith('§2Guild > ')) return;

  const data = getPlayerDataFromMessage(message.split(':').shift());
  sendEmbed({
    description: Util.escapeMarkdown(message.split(':')[1]),
    color: data.color,
    timestamp: new Date(),
    author: {
      name: Util.escapeMarkdown(message.split(':').shift()),
      icon_url: 'https://mc-heads.net/avatar/' + data.name,
    },
  });
};

function sendEmbed(embed) {
  guildChatLog.send({ embeds: [embed] }).catch(console.error);
}

function getPlayerDataFromMessage(msg) {
  const args = msg.split(' ');
  if (args[0].startsWith('[')) {
    let color = '';
    if (args[0].startsWith('[VIP')) {
      color = '#27f238';
    } else if (args[0].startsWith("[MVP++")){
      color = "#f5c311"
    } else {
       color = '#4fe2ff';
    }
    return { name: args[1], color: color };
  }
  return { name: args[0], color: '#12a602' };
}

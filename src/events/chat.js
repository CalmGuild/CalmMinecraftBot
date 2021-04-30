const { WebhookClient, Util, MessageEmbed } = require('discord.js');

const hook = new WebhookClient(process.env.WEBHOOK_ID, process.env.WEBHOOK_TOKEN);

module.exports = function chat(bot, username, message, translate, jsonMsg, matches) {
  if (!jsonMsg.extra) return;
  if (!jsonMsg.extra[0].text.startsWith('§2Guild > ')) return;
  
  const i = message.indexOf(":");
  if (i === -1) return; // no colon, so it's a join/leave message

  const name = message.slice(0, i);
  const usrMsg = Util.removeMentions(Util.escapeMarkdown(message.slice(i + 2))); // remove mentions, escape markdown, and slice name off

  const j = name.indexOf("] ");
  let ign = name.slice(j !== -1 ? j + 2 : 0); // trim hypixel rank off

  const k = ign.indexOf(" ");
  ign = ign.slice(0, k !== -1 ? k : ign.length); // trim guild rank off

  const rank = j !== -1 ? name.slice(1, j) : "";
  let color = "12a602";

  if (rank === "MOD") color = "00aa00"
  else if (rank === "MVP++") color = "ffaa00";
  else if (rank.startsWith("MVP")) color = "55ffff";
  else if (rank.startsWith("VIP")) color = "55ff55";

  const embed = new MessageEmbed()
    .setAuthor(name, `https://mc-heads.net/avatar/${ign}`)
    .setDescription(usrMsg)
    .setColor(color)
    .setTimestamp();

  hook.send({ embeds: [embed]} );
};

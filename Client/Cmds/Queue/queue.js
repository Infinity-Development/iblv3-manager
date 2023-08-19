const { MessageEmbed } = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const { baseEmojis } = require('@Languages/emojiGen');
const { successClaimText } = require('@Languages/titleGen');
const botStorage = require('@Database/bots');

module.exports = {
  name: 'queue',
  category: 'Queue',
  aliases: ['q', 'list'],
  description: 'View a list of Bots in Queue!',
  args: false,
  usage: `queue`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let numToAdd = 1;
    let bots = await botStorage.find({ type: 'pending' });
    let queue = '';
    if (!bots.length) {
      const nothingInQueue = new MessageEmbed()
        .setDescription(`There no bots in the queue.`)
        .setColor('RED')
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });
      return message.reply({
        embeds: [nothingInQueue],
      });
    }
    for (i = 0; i < (bots.length < 15 ? bots.length : 15); i++) {
      queue += `**${numToAdd++}**. <@!${bots[i].botID}> (\`${
        bots[i].botName
      }\`) | [Inv to Test Server](https://discord.com/oauth2/authorize?client_id=${
        bots[i].botID
      }&permissions=0&guild_id=870952645811134475&scope=bot%20applications.commands&disable_guild_select=true) | [Inv to Main Server](https://discord.com/oauth2/authorize?client_id=${
        bots[i].botID
      }&permissions=0&guild_id=758641373074423808&scope=bot%20applications.commands&disable_guild_select=true)\n`;
    }
    let embed = new MessageEmbed()
      .setTitle('🔃 Our Bot Queue')
      .setColor(styling.iblpurple)
      .setThumbnail(defaults.images.main)
      .setDescription(`${queue}`)
      .addField('Queue Page', `[View the queue](https://infinitybots.gg/queue)`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    message.reply({ embeds: [embed] });
  },
};

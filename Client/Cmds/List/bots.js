const { MessageEmbed } = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const BotStorage = require('@Database/bots');
const config = require('@Settings/Config');

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  return {
    d: d,
    h: h,
    m: m,
    s: s,
  };
}

module.exports = {
  name: 'bots',
  category: 'List',
  aliases: ['listed'],
  description: 'Check how many bots a User has.',
  args: false,
  usage: `bots || bots <@User>`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let numToAdd = 1;
    let fetchBot;

    let member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args.slice(0).join(' ')) ||
      message.member;

    if (!member)
      return message.reply({
        content: 'Looks like that user is not a member of our Server.',
      });

    let check = await BotStorage.find({ main_owner: member.user.id });

    if (member.user.bot)
      return message.reply({
        content: 'Imagine thinking a Bot can own a Bot! 😂',
      });

    if (check.length === 0)
      return message.reply({
        content: 'That user does not have any bots listed here!',
      });

    let botList = await check
      .map((user) => `${numToAdd++}. *${user.botName}* (ID: ${user.botID})\n`)
      .join(' ');

    let embed = new MessageEmbed()
      .setTitle(`${member.user.username}'s Bots`)
      .setColor(styling.iblpurple)
      .setDescription(`Total Bots: ${check.length}`)
      .setThumbnail(member.user.displayAvatarURL())
      .addField('Listed Bots:', `${botList}`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });

    return message.reply({ embeds: [embed] });
  },
};

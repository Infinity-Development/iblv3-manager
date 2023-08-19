const Discord = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const mongoose = require('mongoose');
const config = require('@Settings/Config');
const moment = require('moment');
require('moment-duration-format');

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
  name: 'stats',
  category: 'Info',
  aliases: ['bs', 'botstats'],
  description: 'View some of Infinity Manager`s Statistics.',
  args: false,
  usage: `ibm!stats`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let u = convertMS(client.uptime);

    let uptime =
      u.d +
      ' Day(s): ' +
      u.h +
      ' Hour(s): ' +
      u.m +
      ' Minutes: ' +
      u.s +
      ' Seconds';
    const duration = moment.duration(client.uptime);

    const embed = new Discord.MessageEmbed()
      .setTitle(`**__${client.user.username}'s Statistics:__**`)
      .setColor(styling.iblpurple)
      .setThumbnail(client.user.displayAvatarURL())
      .addField('Developer:', `Toxic Dev#5936`, true)
      .addField(
        'Created On:',
        `${moment.utc(client.user.createdAt).format('dddd Do MMMM YYYY')}`,
        true,
      )
      .addField('Bot Latency:', `${client.ws.ping}ms`, true)
      .addField('Bot Uptime:', `${uptime}`, true)
      .addField('Mongoose:', `v${mongoose.version}`, true)
      .addField('Discord.js:', `v${Discord.version}`, true)
      .addField('Node Version:', `v${process.versions.node}`, true)
      .addField(
        'Memory Usage:',
        `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
        true,
      )
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    return message.reply({ embeds: [embed] });
  },
};

const { MessageEmbed } = require('discord.js');
const package = require('../../../package.json');
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
  name: 'about',
  category: 'Info',
  aliases: [],
  description: 'Tells you a little bit about the bot.',
  args: false,
  usage: `ibm!about`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    const embed = new MessageEmbed()
      .setTitle('**__About InfinityManager:__**')
      .setColor(styling.iblpurple)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(
        'Just a simple little bot made to help us Moderate & Manage the Infinity Bot List server.',
      )
      .addField('Code Public:', "No the bot isn't open source", true)
      .addField('Invite Status:', 'Private Bot', true)
      .addField('Current Version:', `v${package.version}`, true)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    return message.reply({ embeds: [embed] });
  },
};

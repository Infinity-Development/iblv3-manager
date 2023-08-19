const { MessageEmbed } = require('discord.js');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const config = require('@Settings/Config');
const mongo = require('mongoose');

module.exports = async (client, member) => {
  let count = member.guild.memberCount.toString();
  let end = count[count.length - 1];
  let suffixed = end == 1 ? count : end == 2 ? count : end == 3 ? count : count;

  const the_member = await client.users.cache.get(member.user.id);
  let bot = await member.guild.roles.cache.get('817811440991469599');
  let rules = await member.guild.channels.cache.find(
    (c) => c.id === '758642704782589973',
  );
  let selfRoles = await member.guild.channels.cache.find(
    (c) => c.id === '796335331384623135',
  );

  if (member.user.bot) {
    const botJoin = new MessageEmbed()
      .setTitle('**__New Bot Joined:__**')
      .setColor(styling.iblpurple)
      .setThumbnail(the_member.displayAvatarURL())
      .setDescription(
        `${member.user.username} has joined the server and is ready for its approved role!`,
      )
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    await member.guild.channels.cache
      .get('762958420277067786')
      .send({ embeds: [botJoin] });

    await member.roles.add(bot);
  } else {
    const userJoin = new MessageEmbed()
      .setTitle('**__New User Joined:__**')
      .setColor(styling.iblpurple)
      .setThumbnail(the_member.displayAvatarURL())
      .setDescription(
        `Welcome to Infinity Bot List: ${member.user.username} Please make sure you check out the: ${rules} channel and get some roles here: ${selfRoles}!`,
      )
      .addField('Total Members:', `${suffixed}`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    await member.guild.channels.cache
      .get('762958420277067786')
      .send({ content: `<@${member.user.id}>`, embeds: [userJoin] });
  }
};

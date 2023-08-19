const { MessageEmbed } = require('discord.js');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const config = require('@Settings/Config');
const botStorage = require('@Database/bots');
const userStorage = require('@Database/users');
const mongo = require('mongoose');

module.exports = async (client, member) => {
  try {
    let numToAdd = 1;
    if (member.user.bot) {
      let checkBot = await botStorage.findOne({
        botID: member.user.id,
        type: 'approved',
      });

      if (checkBot) {
        await checkBot.deleteOne();
        let owner = await botStorage.find({
          main_owner: checkBot.main_owner,
          type: 'approved',
        });

        if (owner.length === 0) {
          member.guild.members.cache
            .get(checkBot.main_owner)
            .roles.remove(member.guild.roles.cache.get('758756147313246209'));
        }
      }
    } else {
      let check = await botStorage.findOne({ main_owner: member.user.id });

      if (check.length > 0) {
        const embed = new MessageEmbed()
          .setTitle('**__Bot Owner Left:__**')
          .setColor('#4242f5')
          .setDescription(
            `**${member.user.tag} has left the server! All of their bots are safe should they decide to rejoin!**`,
          )
          .addField('User Owns:', `${check.length} bots`)
          .addField(
            'Bots:',
            `${check
              .map((bot) => `${numToAdd++}. <@!${bot.botID}>\n`)
              .join('**,**')}`,
          )
          .setTimestamp()
          .setFooter({
            text: defaults.footers.version,
            iconURL: defaults.images.main,
          });

        await member.guild.channels.cache
          .get('911907978926493716')
          .send({ embeds: [embed] });
      }
    }
  } catch (err) {
    return console.log(err.stack);
  }
};

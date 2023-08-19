const { MessageEmbed } = require('discord.js');
const colors = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const botStorage = require('@Database/bots');

module.exports = {
  name: 'vote-reset',
  category: 'Admin',
  aliases: ['vr', 'vcr'],
  description: 'Reset the Vote Count for all bots. Should be done monthly.',
  args: false,
  usage: `ibm!vote-reset`,
  permission: [],
  ownerLock: true,
  staffLock: false,

  execute: async (message, args, client) => {
    try {
      const embed = new MessageEmbed()
        .setTitle('**__Owner Action: Monthly Reset__**')
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `<a:nope:828141247616122910> Now wait while I do this.. Might take a while...`,
        )
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });
      await message
        .reply({ embeds: [embed] })
        .then(async (msg) => {
          await botStorage.updateMany({ $set: { votes: 0 } });

          await msg.delete({ timeout: 10000 });

          const embed2 = new MessageEmbed()
            .setTitle('**__Owner Action: Monthly Reset__**')
            .setColor(colors.blurple)
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription(`😂 Right happy now, I have done a rest?`)
            .setTimestamp()
            .setFooter({
              text: defaults.footers.version,
              iconURL: defaults.images.main,
            });
          return message.channel.send({ embeds: [embed2] });
        }, 10000)
        .catch(console.error);
    } catch (err) {
      const error = new MessageEmbed()
        .setTitle('**__Error:__**')
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .addField('Error Message:', `${err.message}`)
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });
      console.log(err.stack);
      return message.channel.send({ embeds: [error] });
    }
  },
};

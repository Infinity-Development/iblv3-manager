const { MessageEmbed } = require('discord.js');
const colors = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const { baseEmojis, staffEmojis } = require('@Languages/emojiGen');
const UserStorage = require('@Database/users');
const config = require('@Settings/Config');
const { post } = require('node-superfetch');

module.exports = {
  name: 'add-staff',
  category: 'Admin',
  aliases: ['add', 'as', 'ns'],
  description: 'Add a User to our Database as a Staff Member.',
  args: false,
  usage: `ibm!add-staff <@User>`,
  permission: [],
  ownerLock: false,
  staffLock: false,
  managerLock: true,

  execute: async (message, args, client) => {
    try {
      let user =
        message.mentions.users.first() || client.users.cache.get(args[0]);

      const Ummmm = new MessageEmbed()
        .setTitle(`**__${baseEmojis.errors} Error: Invalid Args:__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `${baseEmojis.errors} Please provide a ID before going ahead.`,
        )
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          viconURL: defaults.images.main,
        });

      if (!user || user.bot) return message.reply({ embeds: [Ummmm] });
      let isUser = await UserStorage.findOne(
        { userID: user.id },
        { _id: false },
      );

      const WhatTheF = new MessageEmbed()
        .setTitle(`**__${baseEmojis.errors} Are you sure about that:__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `${baseEmojis.errors} Looks like this user is already a Member of the team.`,
        )
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      if (isUser.staff) return message.reply({ embeds: [WhatTheF] });
      else {
        await isUser.updateOne({ staff: true });

        const IsThatShit = new MessageEmbed()
          .setTitle(`**__${baseEmojis.success} Updated Staff:__**`)
          .setColor(colors.blurple)
          .setThumbnail(client.user.displayAvatarURL())
          .setDescription(
            `<@${user.id}> has been added to the Staff Team Successfully ${baseEmojis.success}`,
          )
          .setTimestamp()
          .setFooter({
            text: defaults.footers.version,
            iconURL: defaults.images.main,
          });
        return message.reply({ embeds: [IsThatShit] });
      }
    } catch (e) {
      let role = await client.guilds.cache
        .get('915000865537007686')
        .roles.cache.get('932765566207414273');

      const errChan = await client.channels.cache.find(
        (c) => c.id === '915000866648494097',
      );

      const errEmbed = new MessageEmbed()
        .setTitle(`**__${baseEmojis.errors} Error: Command Failure:__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `${baseEmojis.errors} Something didn't work right, Please try again if this happens again let the Development Team know. ❤`,
        )
        .addField('Error:', `${e}`)
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      const errLogger = new MessageEmbed()
        .setTitle(`**__${baseEmojis.errors} Error: Command Failure__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription('Error while executing the: `add-staff` command.')
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      if (e.length > 1000) {
        const body = await post('https://source.toxicdev.me/documents').send(
          e.stack,
        );
        errLogger.addField(
          'Error Logs:',
          `https://source.toxicdev.me/${body.key}`,
        );
      } else {
        errLogger.addField('Error:', `${e.stack}`);
        await errChan.send({ content: `${role}`, embeds: [errLogger] });
      }
      return message.reply({ embeds: [errEmbed] });
    }
  },
};

const Discord = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');

module.exports = {
  name: 'cmdinfo',
  category: 'Info',
  aliases: ['cinfo'],
  description: 'Gives you info of a command.',
  args: false,
  usage: `ibm!cmdinfo <command>`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let command = client.commands.get(args[0]);
    if (!command) {
      const noCmds = new Discord.MessageEmbed()
        .setDescription(`Please provide a command?`)
        .setColor('RED')
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });
      return message.reply({
        embeds: [noCmds],
      });
    }
    const embed = new Discord.MessageEmbed()
      .setTitle(`**__Command Information:__**`)
      .setColor(styling.iblpurple)
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`Here's some info for the: ${command.name} command.`)
      .addField(
        'Description:',
        `${command.description || 'No description provided'}`,
      )
      .addField('Category:', `${command.category || 'No category provided'}`)
      .addField('Aliases:', `${command.aliases || 'No aliases provided'}`)
      .addField('Usage:', `${command.usage || 'No command usage examples'}`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    message.reply({
      embeds: [embed],
    });
  },
};

const { MessageEmbed } = require('discord.js');
const defaults = require('@Handlers/Embeds/Defaults');

module.exports = {
  name: 'reportbug',
  category: 'Bot',
  aliases: ['bug', 'report'],
  description: 'Send a report into the Developers if you spot an issue.',
  args: false,
  usage: `ibm!reportbug <Your_Bug>`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let Suggestion = args.join(' ').slice(0);
    if (!Suggestion)
      return message.reply({
        content: 'Now you must tell me what you want to send? 🤔',
      });

    const embed = new MessageEmbed()
      .setTitle('**__New Reportbug:__**')
      .setColor('#5865f2')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`${Suggestion}`)
      .addField('Submitted By:', `${message.author.tag}`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });

    let suggestionChannel = client.channels.cache.find(
      (c) => c.id === '818510422851190785',
    );

    await suggestionChannel.send({ embeds: [embed] }).then(async (msg) => {
      await msg.react('<:upvote:789992067031236659>');
    });

    const embed2 = new MessageEmbed()
      .setTitle('**__Reportbug Sent:__**')
      .setColor('#5865f2')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('I have sent this to the bug-report channel.')
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    return message.reply({ embeds: [embed2] });
  },
};

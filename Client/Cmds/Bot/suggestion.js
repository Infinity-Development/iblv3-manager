const { MessageEmbed } = require('discord.js');
const defaults = require('@Handlers/Embeds/Defaults');

module.exports = {
  name: 'suggestion',
  category: 'Bot',
  aliases: ['suggest', 'sg'],
  description: 'Send a suggestion that you want adding.',
  args: false,
  usage: `ibm!suggestion <Your_Suggestion_Here>`,
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
      .setTitle('**__New Suggestion Submitted:__**')
      .setColor('BLUE')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`${Suggestion}`)
      .addField('Submitted By:', `${message.author.tag}`)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });

    let suggestionChannel = client.channels.cache.find(
      (c) => c.id === '818113063973683220',
    );

    await suggestionChannel.send({ embeds: [embed] }).then(async (msg) => {
      await msg.react('<:upvote:789992067031236659>');
      await msg.react('<:downvote:825776419405299762>');
    });

    const embed2 = new MessageEmbed()
      .setTitle('**__Suggestion Sent:__**')
      .setColor('BLUE')
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription('Okay I have sent that suggestion in.')
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    return message.reply({ embeds: [embed2] });
  },
};

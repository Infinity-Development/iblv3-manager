const { MessageEmbed } = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const { baseEmojis } = require('@Languages/emojiGen');
const botStorage = require('@Database/bots');

module.exports = {
  name: 'unclaim',
  category: 'Queue',
  aliases: ['yeet'],
  description: 'UnClaim a bot from our Queue!',
  args: true,
  usage: `unclaim <@Bot>`,
  permission: [],
  ownerLock: false,
  staffLock: true,

  execute: async (message, args, client) => {
    let fetchBot =
      message.mentions.users.first() || client.users.cache.get(args[0]);

    let noUser = new MessageEmbed()
      .setTitle('Error: Missing Args!')
      .setColor('RED')
      .setThumbnail(defaults.images.anim)
      .setDescription(
        'Please ping the bot you would like to unclaim or provide the Bot ID!',
      )
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    if (!fetchBot) return message.reply({ embeds: [noUser] });

    let botFetch = await botStorage.findOne({ botID: fetchBot.id });

    let botClaimed = new MessageEmbed()
      .setTitle('Error: Execution Failed!')
      .setColor('RED')
      .setThumbnail(defaults.images.anim)
      .setDescription('This bot has not been claimed')
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    if (!botFetch.claimed) return message.reply({ embeds: [botClaimed] });

    await botFetch.updateOne({ claimed: false, claimedBy: null });

    let embed = new MessageEmbed()
      .setTitle(`${baseEmojis.mint} Bot Unclaimed!`)
      .setColor(styling.iblpruple)
      .setThumbnail(defaults.images.anim)
      .setDescription('Okay i have unclaimed that bot!')
      .addField('Bot ID', `${botFetch.botID}`, true)
      .addField('Bot Name', `${botFetch.botName}`, true)
      .addField('UnClaimed By', `${message.author.tag}`, true)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    await message.reply({ embeds: [embed] });

    let ownerEmbed = new MessageEmbed()
      .setTitle(`${baseEmojis.mint} Bot Unclaimed!`)
      .setColor(styling.iblpruple)
      .setThumbnail(defaults.images.anim)
      .setDescription(
        'Your bot has been unclaimed and is no longer being tested!',
      )
      .addField('Bot ID', `${botFetch.botID}`, true)
      .addField('Bot Name', `${botFetch.botName}`, true)
      .addField('Claimed By', `${message.author.tag}`, true)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    await client.users.cache
      .get(botFetch.main_owner)
      .send({ embeds: [ownerEmbed] })
      .catch(() => {
        return message.reply(
          'I tried to notify the Bot Owner but they do not seem to be allowing DMs',
        );
      });
  },
};

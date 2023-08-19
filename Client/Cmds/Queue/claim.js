const { MessageEmbed } = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const { baseEmojis } = require('@Languages/emojiGen');
const { successClaimText } = require('@Languages/titleGen');
const botStorage = require('@Database/bots');

module.exports = {
  name: 'claim',
  category: 'Queue',
  aliases: ['take', 'test'],
  description: 'Claim a bot from our Queue for testing!',
  args: true,
  usage: `claim <@Bot>`,
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
        'Please ping the bot you would like to claim or provide the Bot ID!',
      )
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    if (!fetchBot) return message.reply({ embeds: [noUser] });

    if (!fetchBot.bot)
      return message.reply({ content: 'Bruhh, How you gonna claim a human!' });

    let botFetch = await botStorage.findOne({ botID: fetchBot.id });

    let botClaimed = new MessageEmbed()
      .setTitle('Error: Unable to Claim!')
      .setColor('RED')
      .setThumbnail(defaults.images.anim)
      .setDescription(
        `This bot was already claimed by <@${botFetch.claimedBy}>`,
      )
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    if (botFetch.claimed) return message.reply({ embeds: [botClaimed] });

    let claimMessage =
      successClaimText[Math.floor(Math.random() * successClaimText.length)];

    await botFetch.updateOne({ claimed: true, claimedBy: message.author.id });

    let embed = new MessageEmbed()
      .setTitle(`${baseEmojis.mint} Bot Claimed!`)
      .setColor(styling.iblpruple)
      .setThumbnail(defaults.images.anim)
      .setDescription(`${claimMessage}`)
      .addField('Bot ID', `${botFetch.botID}`, true)
      .addField('Bot Name', `${botFetch.botName}`, true)
      .addField('Claimed By', `${message.author.tag}`, true)
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.anim,
      });

    await message.reply({ embeds: [embed] });

    let ownerEmbed = new MessageEmbed()
      .setTitle(`${baseEmojis.mint} Bot Claimed!`)
      .setColor(styling.iblpruple)
      .setThumbnail(defaults.images.anim)
      .setDescription('Your bot has been claimed and is now being tested!')
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

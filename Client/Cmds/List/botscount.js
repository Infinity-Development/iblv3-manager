const { MessageEmbed } = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const { baseEmojis } = require('@Languages/emojiGen');
const { successClaimText } = require('@Languages/titleGen');
const botStorage = require('@Database/bots');

module.exports = {
  name: 'botscount',
  category: 'List',
  aliases: ['bc', 'botcount'],
  description: 'View our Total Bot Count',
  args: false,
  usage: `botscount`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    try {
      let approved;
      let denied;
      let certified;

      let embed = new MessageEmbed()
        .setTitle('Fetching the Bot Count')
        .setColor(styling.iblpurple)
        .setDescription('Okay, Please wait while i gather the stats')
        .setThumbnail('https://i.imgur.com/9IrfqRq.gif')
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      await message
        .reply({ embeds: [embed] })
        .then(async (msg) => {
          approved = await botStorage.find(
            { type: 'approved' },
            { _id: false },
          );
          denied = await botStorage.find({ type: 'denied' }, { _id: false });
          certified = await botStorage.find(
            { certified: true },
            { _id: false },
          );

          await msg.delete({ timeout: 10000 });
        }, 10000)
        .catch(console.error);

      let embed2 = new MessageEmbed()
        .setTitle('Total Bot Count')
        .setColor(styling.iblpurple)
        .setDescription('Heres our Bot Stats xD')
        .setThumbnail(defaults.images.main)
        .addField('Approved', `${approved.length}`, true)
        .addField('Certified', `${certified.length}`, true)
        .addField('Denied', `${denied.length}`, true)
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      return message.reply({ embeds: [embed2] });
    } catch (e) {
      let embed3 = new MessageEmbed()
        .setTitle('Error: Command Failure')
        .setColor('RED')
        .setDescription(
          'Woah, Something went wrong here. If this issue continues please contact our Dev Team',
        )
        .addField('Error Message', `${e}`)
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });

      await ManagerLogs.send(`Error executing command: ${e.stack}`, 'error');

      return message.channel.send({ embeds: [embed3] });
    }
  },
};

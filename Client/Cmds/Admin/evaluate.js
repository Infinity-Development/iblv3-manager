const { MessageEmbed } = require('discord.js');
const colors = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const { baseEmojis, staffEmojis } = require('@Languages/emojiGen');
const UserStorage = require('@Database/users');
const config = require('@Settings/Config');
const { post } = require('node-superfetch');

module.exports = {
  name: 'eval',
  category: 'Admin',
  aliases: ['ev', 'code'],
  description: 'Evaluate some Code Snippets. (Typically JavaScript)',
  args: false,
  usage: `ibm!eval <CodeToEval>`,
  permission: [],
  ownerLock: true,
  staffLock: false,
  managerLock: false,

  execute: async (message, args, client) => {
    try {
      let codeIn = args.slice(0).join(' ');
      let code = eval(codeIn);

      if (typeof code !== 'string')
        code = require('util').inspect(code, { depth: 0 });

      const embed = new MessageEmbed()
        .setTitle(`**__${baseEmojis.coding} Code Evaluation:__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .addField('📥 | **Input:**', `\`\`\`js\n${codeIn}\`\`\``)
        .addField('📤 | **Output:**', `\`\`\`js\n${code}\n\`\`\``)
        .setTimestamp()
        .setFooter({
          text: defaults.footers.version,
          iconURL: defaults.images.main,
        });
      return message.reply({ embeds: [embed] });
    } catch (e) {
      let role = await client.guilds.cache
        .get('915000865537007686')
        .roles.cache.get('932765566207414273');

      const errChan = await client.channels.cache.find(
        (c) => c.id === '915000866648494097',
      );

      const errEmbed = new MessageEmbed()
        .setTitle(`**__${baseEmojis.errors} Error: Command Failure__**`)
        .setColor(colors.blurple)
        .setThumbnail(client.user.displayAvatarURL())
        .setDescription(
          `${baseEmojis.errors} I have mentioned the Development Team & they will look into this issue.`,
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
        .setDescription(
          `${baseEmojis.errors} Error while executing the: "eval" command.`,
        )
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

const { MessageEmbed } = require('discord.js');
const config = require('../../Settings/Config');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  let prefix = config.PREFIX;
  const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);

  if (message.content.match(mention)) {
    const woah = new MessageEmbed()
      .setTitle(`**__${client.user.username}'s Info:__**`)
      .setColor(styling.iblpurple)
      .setThumbnail(defaults.images.main)
      .setDescription(
        `Woah you needing some help here? Well my prefix is: \`${prefix}\``,
      )
      .addField('Commands:', `${prefix}help`)
      .addField('Command Information:', `${prefix}help <CmdName>`)
      .addField('Usage Information:', '<> = Required | [] = Optional')
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    return message.channel.send({ embeds: [woah] });
  }

  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`,
  );

  if (!prefixRegex.test(message.content)) return;

  const [matchedPrefix] = message.content.match(prefixRegex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
    );

  if (!command) return;

  const embed = new MessageEmbed()
    .setTitle('Error: Command Level')
    .setColor('#756ed4')
    .setThumbnail(defaults.images.main)
    .setTimestamp()
    .setFooter({
      text: defaults.footers.version,
      iconURL: defaults.images.main,
    });

  if (command.args && !args.length) {
    let reply = `Okay listen. You need to provide some valid args!`;

    if (command.usage) {
      reply += `\nUsage: \`${prefix}${command.usage}\``;
    }

    embed.setDescription(reply);
    return message.reply({ embeds: [embed] });
  }

  if (
    command.permission &&
    !message.member.permissions.has(command.permission)
  ) {
    embed.setDescription('😏 Now I bet you wish you could do that.');
    return message.reply({ embeds: [embed] });
  }

  if (command.ownerLock && !config.OWNERS.includes(message.author.id)) {
    embed.setDescription('🔨 Now these commands are locked to the Owners.');
    return message.reply({ embeds: [embed] });
  }

  if (command.managerLock && !config.MANAGERS.includes(message.author.id)) {
    embed.setDescription(
      '👻 Well now again these commands locked to the Staff Managers.',
    );
    return message.reply({ embeds: [embed] });
  }

  if (command.staffLock && !config.ADMINS.includes(message.author.id)) {
    embed.setDescription(
      '😐 Look come on you must know these commands are locked to the Website Moderators.',
    );
    return message.reply({ embeds: [embed] });
  }

  try {
    command.execute(message, args, client, prefix);
    ManagerLogs.send(`Command Execution Successful | Name: ${command.name}`);
  } catch (e) {
    ManagerLogs.send(
      `Something went wrong while executing command: ${command.name} | Error: ${e.stack}`,
      'error',
    );

    embed.setDescription(
      "🤔 Now that wasn't meant to happen... If this happens again Please do: ibm!reportbug [Then the bug] this means the Development Team can look! ❤",
    );
    return message.reply({ embeds: [embed] });
  }
};

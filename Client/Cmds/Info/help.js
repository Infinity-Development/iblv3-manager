const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
} = require('discord.js');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const config = require('@Settings/Config');
const { readdirSync } = require('fs');

module.exports = {
  name: 'help',
  category: 'Info',
  aliases: ['h', 'list', 'helpme', 'cmds', 'commands'],
  description: 'View the Help Message and a list of Commands.',
  args: false,
  usage: `ibm!help`,
  permission: [],
  ownerLock: false,
  staffLock: false,

  execute: async (message, args, client) => {
    let prefix = config.PREFIX;
    const categories = readdirSync(`${__dirname}/../../../Client/Cmds`);
    let embed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username} - Help Menu`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor(styling.iblpurple)
      .setDescription(
        `>>> My prefix is \`${prefix}\`\n Use the menu to view a list of commands based on their category.\n<> \`${prefix}cmdinfo <command>\` to get info of a command.`,
      )
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: defaults.footers.version,
        iconURL: defaults.images.main,
      });
    const emoji = {
      Admin: '🛡️',
      Bot: '🤖',
      Info: 'ℹ️',
      List: '🗒️',
      Queue: '💎',
    };
    let raw = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId('help-menu')
        .setPlaceholder('Click to see my command categories')
        .addOptions([
          categories.map((cat) => {
            return {
              label: `${cat[0].toUpperCase() + cat.slice(1)}`,
              value: cat,
              emoji: emoji[cat],
              description: `Click to See Commands for: ${cat}`,
            };
          }),
        ]),
    ]);
    let raw2 = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('home')
        .setLabel('Home')
        .setStyle('PRIMARY')
        .setEmoji('🏘️'),
    ]);
    message
      .reply({
        embeds: [embed],
        components: [raw, raw2],
      })
      .then(async (msg) => {
        let filter = (i) => i.user.id === message.author.id;
        let colector = await msg.createMessageComponentCollector({
          filter: filter,
        });
        colector.on('collect', async (i) => {
          if (i.isButton()) {
            if (i.customId === 'home') {
              await i.deferUpdate().catch((e) => {});

              msg
                .edit({
                  embeds: [embed],
                })
                .catch((e) => {});
            }
          }
          if (i.isSelectMenu()) {
            if (i.customId === 'help-menu') {
              await i.deferUpdate().catch((e) => {});
              let [directory] = i.values;
              let aa = new MessageEmbed()
                .setTitle(`Commands for: ${directory}`)
                .setColor(styling.iblpurple)
                .setDescription(
                  `>>> ${client.commands
                    .filter((cmd) => cmd.category === directory)
                    .map((cmd) => {
                      return [`\`${prefix}${cmd.name}\``].join(' ');
                    })
                    .join('\n')}`,
                )
                .setFooter({
                  text: defaults.footers.version,
                  iconURL: defaults.images.main,
                });
              msg.edit({
                embeds: [aa],
              });
            }
          }
        });
      });
  },
};

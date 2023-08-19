const { MessageEmbed } = require('discord.js');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const styling = require('@Handlers/Embeds/Colors');
const defaults = require('@Handlers/Embeds/Defaults');
const config = require('@Settings/Config');
const mongo = require('mongoose');

module.exports = async (client) => {
  await mongo
    .connect(config.MONGO, {
      family: 4,
      autoIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,
    })
    .catch((e) =>
      ManagerLogs.send(`Error with the Database: ${e.stack}`, 'error'),
    );
  ManagerLogs.send('Okay I have connected to the Databse.', 'ready');

  const readyChannel = await client.channels.cache.find(
    (c) => c.id === '915000866648494097',
  );
  client.user.setActivity(`ibm!help | InfinityManager`, { type: 'WATCHING' });

  const embed = new MessageEmbed()
    .setTitle('**__Start-Up: Success__**')
    .setColor(styling.iblpurple)
    .setThumbnail(defaults.images.main)
    .setDescription(
      `• Issues: 0\n• Database: Connected\n• Status: Online\n• Version: v2.0.0\n• Ping: ${client.ws.ping}ms`,
    )
    .setTimestamp()
    .setFooter({
      text: defaults.footers.version,
      iconURL: defaults.images.main,
    });

  await readyChannel.send({ embeds: [embed] });
  ManagerLogs.send(
    'InfinityManager is online connected to everything.',
    'ready',
  );
};

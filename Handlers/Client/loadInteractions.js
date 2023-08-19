const { Client, Collection, Intents } = require('discord.js');
const { Routes } = require('discord-api-types/v9');
const { REST } = require('@discord.js/rest');
const { resolve } = require('path');
const { sync } = require('glob');
const config = require('../../Settings/Config');

require('./Interaction');

async function loadInteraction(guildId, client) {
  const intFile = await sync(resolve('../interactions/**/*.ts'));
  intFile.forEach((filepath) => {
    const File = require(filepath);
    if (!(File.prototype instanceof Interaction)) return;
    const interaction = new File();
    interaction.client = client;
    client.interactions.set(interaction.name, interaction);
    const res = new REST({ version: '9' }).setToken(config.TOKEN);
    res.put(Routes.applicationCommands(config.clientID, { body: interaction }));
  });
}
module.exports = loadInteraction;

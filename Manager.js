require('module-alias/register');
const { Client, Collection, Intents } = require('discord.js');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');
const mongoose = require('mongoose');
const { readdirSync } = require('fs');
const config = require('@Settings/Config');
const LoadListeners = require('@Packages/LoadListeners');
const loadCommands = require('@Packages/LoadCommands');
const { baseEmojis, staffEmojis } = require('./Languages/emojiGen');
const client = new Client({
  shards: 'auto',
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
  allowedMentions: {
    parse: ['roles', 'users', 'everyone'],
    repliedUser: false,
  },
  partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});

module.exports = client;
client.logger = ManagerLogs;
client.config = config;
client.commands = new Collection();
client.aliases = new Collection();
client.categories = new Collection();
client.limits = new Map();
client.staffEmojis = staffEmojis;
client.baseEmojis = baseEmojis;

mongoose.connection.on('err', () => {
  console.log(
    `[IBL-Mongo-Logger] - Mongoose Connection Error:\n Stack: ${error.stack}`,
    'error',
  );
});

mongoose.connection.on('disconnected', () => {
  console.log('[IBL-Mongo-Logger] - Mongoose has been Disconnected.');
});

client.on('disconnect', () => {
  console.log(
    '[IBL-Client-Logger] - Client is Disconnecting from the Discord API.',
  );
});

client.on('reconnecting', () => {
  console.log(
    '[IBL-Client-Logger] Client is Reconnecting to the Discord API, Please wait.',
  );
});

client.on('warn', (error) => {
  console.log(
    `[IBL-Client-Logger] - Warning: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});

client.on('error', (error) => {
  console.log(
    `[IBL-Client-Logger] - Error: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});

process.on('unhandledRejection', (error) => {
  console.log(
    `[IBL-Client-Logger] - Unhandled_Rejection: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});
process.on('uncaughtException', (error) => {
  console.log(
    `[IBL-Client-Logger] - Uncaught_Exception: \n Message: ${error} \n Stack: ${error.stack}`,
  );
});

LoadListeners(client);
loadCommands(client);
client.login(config.TOKEN);

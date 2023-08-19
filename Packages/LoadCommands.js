const { readdirSync } = require('fs');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');

function loadCommands(client) {
  readdirSync('./Client/Cmds').forEach((dir) => {
    const commandFiles = readdirSync(`./Client/Cmds/${dir}/`).filter((f) =>
      f.endsWith('.js'),
    );
    for (const file of commandFiles) {
      const command = require(`../Client/Cmds/${dir}/${file}`);
      ManagerLogs.send(
        `Loading command: ${command.name} from Category: ${command.category}`,
        'event',
      );
      client.commands.set(command.name, command);
    }
  });
}
module.exports = loadCommands;

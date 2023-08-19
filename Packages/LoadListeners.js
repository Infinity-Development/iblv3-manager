const { readdirSync } = require('fs');
const ManagerLogs = require('@Handlers/Logger/ManagerLogs');

function LoadListeners(client) {
  readdirSync('./Client/Events/').forEach((file) => {
    const event = require(`../Client/Events/${file}`);
    let eventName = file.split('.')[0];
    ManagerLogs.send(`Loading Event: ${eventName}`, 'event');
    client.on(eventName, event.bind(null, client));
  });
}
module.exports = LoadListeners;

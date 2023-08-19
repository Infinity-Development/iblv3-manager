const { Schema, model } = require('mongoose');

module.exports = model(
  'tickets',
  new Schema({
    channelID: { type: String },
    topic: { type: String },
    userID: { type: String },
    ticketID: { type: Number },
    logURL: { type: String, default: '' },
    closeUserID: { type: String, default: '' },
    open: { type: Boolean, default: true },
    panelMessageID: { type: String, default: 'No panel active' },
    panelChannelID: { type: String, default: 'No panel active' },
  }),
);

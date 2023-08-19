const { Schema, model } = require('mongoose');

module.exports = model(
  'transcripts',
  new Schema({
    closedBy: Object,
    openedBy: Object,
    data: Object,
    ticketID: String,
  }),
);

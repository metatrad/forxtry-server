const mongoose = require('mongoose');

const scheduledTaskSchema = mongoose.Schema({
  tradeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  job: { type: Object, required: true }, 
});

const ScheduledTask = mongoose.model('ScheduledTask', scheduledTaskSchema);

module.exports = { ScheduledTask };

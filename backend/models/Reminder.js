const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// creating Reminder schema
const ReminderSchema = new Schema(
  {
    // all below fields are required
    userId: {
      type: mongoose.Schema.Types.ObjectID,
      ref: 'User',
    },
    subject: {
      type: String,
      required: true,
    },
    startTime: {
      type: Number,
      required: true,
    },
    endTime : {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, //so that we have createdAt and updatedAt fields
  }
);

const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = Reminder;

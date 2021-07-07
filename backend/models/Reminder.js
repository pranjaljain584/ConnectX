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
    Subject: {
      type: String,
      required: true,
    },
    StartTime: {
      type: Date,
    },
    EndTime: {
      type: Date,
    },
    Description: {
      type: String,
    },
    isAllDay: {
      type: Boolean,
    },
    mailSent : {
      type:Boolean ,
      default: false ,
    }
  },
  {
    timestamps: true, //so that we have createdAt and updatedAt fields
  }
);

const Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = Reminder;

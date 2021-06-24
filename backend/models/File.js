const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// creating user schema
const FileSchema = new Schema(
  {
    // all below fields are required
    name: {
      type: String,
    },
    base64String: {
      type: String,
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectID,
      ref:'ChatRoom'
    },
  },
  {
    timestamps: true, //so that we have createdAt and updatedAt fields
  }
);

const File = mongoose.model('File', FileSchema);

module.exports = File;

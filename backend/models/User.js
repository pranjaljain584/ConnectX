const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// creating user schema
const UserSchema = new Schema(
  {
    // all below fields are required   
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // email needs to be unique
    },
    password: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true, //so that we have createdAt and updatedAt fields
  }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;

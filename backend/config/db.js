// logic for connection with database
const mongoose = require('mongoose'); // using mmongoose for connection 
// required our json file
const config = require('config');
require('dotenv').config();

// stored mongoURI in 'db' variable
const db = config.get('mongoURI');

const connectDB = async () => {
  try {  // try catch block to catch error

    // await since mongoose.connect returns a promise
    await mongoose.connect(db, {
      // to avoid deprecation warnings  
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    // successfully connected to db
    console.log('Mongodb connected');

  } catch (err) {
    // logged error in connection  
    console.log(err.message);

    //Exit process with Failure
    process.exit(1);
  }
};

// for error handling even after initial connection

const db2 = mongoose.connection;

db2.on('error', console.error.bind(console, 'Error connecting to mongodb'));

db2.once('open', function () {
  console.log('connected to Database :: MongoDB');
});

// export connectDB function
module.exports = connectDB;

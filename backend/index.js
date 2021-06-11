const express = require('express') ;
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// require connectDB function exported in db.js file
const connectDB = require('./config/db');


const app = express() ;

// Init middleware
app.use(bodyParser.json({ extended: false }));
app.use(cors());
app.use(express.json());

// connect database
connectDB();

// define routes
app.use('/api/auth', require('./routes/api/auth'));

const port = process.env.PORT || 5000 ;

app.listen(port, () => console.log(`Server is running at ${port}`));
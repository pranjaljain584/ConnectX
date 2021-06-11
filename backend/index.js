const express = require('express') ;
const cors = require('cors');
const path = require('path');
// require connectDB function exported in db.js file
const connectDB = require('./config/db');


const app = express() ;

// Init middleware
// parses data in req body
app.use(express.json({ extended: false })); 
app.use(cors());

// connect database
connectDB();

// define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));

const port = process.env.PORT || 5000 ;

app.listen(port, () => console.log(`Server is running at ${port}`));
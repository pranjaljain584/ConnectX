const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
// require connectDB function exported in db.js file
const connectDB = require('./config/db');

const app = express();

// Init middleware
// parses data in req body
app.use(express.json({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
)
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
  
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// connect database
connectDB();

// define routes
app.use('/api/users', require('./routes/api/user'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/room', require('./routes/api/room'));


io.on('connection', require('./socketManager'));
// io.on('connected', socketManager);

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server is running at ${port}`));

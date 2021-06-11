const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// GET, api/auth // type of req, url
// Public route

router.get('/',
 auth , // middleware that makes this route a protected route
 async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user); // return user data in json
  } catch (err) {
    res.status(500).send('Server errror');
  }
});

module.exports = router;

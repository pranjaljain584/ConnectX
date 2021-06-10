const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// const User = require('../../models/User');

// GET api/auth
// test route
// Public
router.get('/', async (req, res) => {
    console.log("user") ;
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     res.status(500).send('Server errror');
//   }
});

module.exports = router;

const express = require('express');
// to validate data sent in post request below
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

const User = require('../../models/User');

// POST api/users
// Register User route
// Public
// this will create an user
router.post(
  '/',
  [
    // middleware that checks if the data in req is valid 
    // acc to our set terms or not  
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'please include a valid email').isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req); // errors if found

    if (!errors.isEmpty()) {
      // bad request and return json response containing errors array  
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure request body
    const { email, name, password } = req.body;

    try {
      // find user in user model  
      let user = await User.findOne({ email });

      if (user) {
        // if user already exist return bad request with below mentioned msg
        return res
          .status(400)
          .json({ errors: [{ msg: 'user already exists' }] });
      }

      // user does not already exist , so create one
      user = new User({
        name,
        email,
        password
      });

      // encrypt user password
      // create salt to do hashing
      // await since promise
      const salt = await bcrypt.genSalt(10);
      // hash the password
      user.password = await bcrypt.hash(password, salt);

      // wait till user gets saved
      await user.save();

      // payload is data that you want to send in token
      // here we send user's id to identify which user is logged in
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };


      jwt.sign(
        payload,
        // get our jwtSecret from default.json
        "mySecretToken",
        // token expiration time in ms
        { expiresIn: 360000 },
        (err, token) => { // callback
          if (err) throw err;
          // return json web token
          res.json({ token });
        }
      );

    } catch (err) {

      // if there is any error at any point in try block we reach here
      // return server error  
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

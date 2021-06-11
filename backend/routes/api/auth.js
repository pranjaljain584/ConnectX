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

// POST api/auth
// Authenticate user and get token route
// Public
// login
router.post(
  "/",
  [
    check("email", "please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        // if user doesn't exists
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // check if password matches
      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {  
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

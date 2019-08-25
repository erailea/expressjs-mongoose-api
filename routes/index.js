const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

/* user register */
router.post('/register', async (req, res, next) => {
  const { username, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    password: hashedPass
  })

  try {
    const addedUser = await user.save();
    res.json(addedUser)
  } catch (error) {
    res.json(error)
  }
})

// jwt authenticate
router.post('/authenticate', async (req, res) => {
  const { username, password } = req.body
  try {
    const findedUser = await User.findOne({ username })
    if (!findedUser) {
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      })
    } else {
      const result = await bcrypt.compare(password, findedUser.password)
      if (!result) {
        res.json({
          status: false,
          message: 'Authentication failed, wrong password.'
        })
      } else {
        const payload = { username }

        const token = await jwt.sign(payload, req.app.get('api_secret_key'), { expiresIn: 720 /** 12 saat */ })

        res.json({
          status: true,
          token
        })
      }
    }
  } catch (error) {
    res.json(error)
  }
})


module.exports = router;

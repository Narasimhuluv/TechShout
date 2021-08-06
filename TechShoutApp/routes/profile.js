var express = require('express');
const Post = require('../models/Post');
var router = express.Router();
var auth = require('../middlewares/auth')

var User = require('../models/User');

router.get('/', auth.loggedInUser, (req, res, next) => {
    let userId = req.session.userId || req.session.passport.user;
    User.findById(userId).populate('posts').populate('comments').exec((error, user) => {
        res.send(user);
    });
  });

module.exports = router;
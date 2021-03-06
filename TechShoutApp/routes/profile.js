var express = require('express');
const Post = require('../models/Post');
var router = express.Router();
var auth = require('../middlewares/auth')
var path = require('path')

var User = require('../models/User');

router.get('/', auth.loggedInUser, (req, res, next) => {
    let userId = req.session.userId || req.session.passport.user;
    Post.find({"author": userId}).populate('comments').exec((error, posts) => {
      res.render('profile',{posts});
    });
  });

module.exports = router;
var express = require('express');
var router = express.Router();

var auth = require('../middlewares/auth');
var Post = require('../models/Post')

router.get('/', auth.loggedInUser, (req, res, next) => {
    let userId = req.session.userId || req.session.passport.user;
    Post.find({}).populate('comments').populate('author').exec((error, posts) => {
      // return res.send(posts)
      res.render('home', {posts})
    });
  });

module.exports = router;
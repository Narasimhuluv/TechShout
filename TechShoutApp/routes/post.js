var express = require('express');
var router = express.Router();

var Post = require('../models/Post');
var User = require('../models/User')

// GET new post 
router.get('/new', (req, res, next) => {
    console.log("HI")
   res.render('tempPost');
})

//POST new post
router.post('/', (req, res, next) => {
    const userId = req.user.id;
    req.body.author = userId;
    Post.create(req.body, (error, post) => {
        if(error) return next(error);
        User.findByIdAndUpdate(userId, {$push:{"posts":post.id}}, (error, user) => {
            res.send(user)
        })
        // res.send(post);
    })
})

// GET all posts
router.get('/', (req, res, next) => {
    req.body.author = req.user.id;
    Post.find({}, (error, posts) => {
        if(error) return next(error);
        res.send(posts);
    })
})

// GET editPost form 
router.get('/:id/edit', (req, res, next) => {
    var postId = req.params.id;
    Post.findById(postId, (error, post) => {
        res.render('tempPostEdit', {post})
    })
})

//UPDATE post
router.post('/:id/update', (req, res, next) => {
    var postId = req.params.id;
    Post.findByIdAndUpdate(postId, req.body, (error, post) => {
        if(error) return next(error);
        res.send(post)
    })
})

// POST like 
//POST unlike

module.exports = router;


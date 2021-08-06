var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');
var Post = require('../models/Post')

router.get('/new', (req, res, next) => {
    console.log("HI")
   res.render('tempComment');
})

router.post('/:postId', (req, res, next) => {
    var postId = req.params.postId; 
    Comment.create(req.body, (error, comment) => {
        if(error) return next(error);
        Post.findByIdAndUpdate(postId, {$push:{"comments":comment.id}}, (error, post) => {
            if(error) return next(error);
            res.send(post);
        })
    })
})

module.exports = router;


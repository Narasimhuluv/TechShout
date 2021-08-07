var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');
var Post = require('../models/Post')

// GET new comment 
router.get('/new', (req, res, next) => {
   res.render('tempComment');
})

//POST new comment
router.post('/:postId', (req, res, next) => {
    var postId = req.params.postId; 
    req.body.post = postId;
    req.body.author = req.user.id;
    Comment.create(req.body, (error, comment) => {
        if(error) return next(error);
        Post.findByIdAndUpdate(postId, {$push:{"comments":comment.id}}, (error, post) => {
            if(error) return next(error);
            res.send(post);
        })
    })
})



module.exports = router;


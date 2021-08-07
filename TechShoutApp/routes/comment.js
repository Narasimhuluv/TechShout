var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment');
var Post = require('../models/Post');

// GET new comment 
router.get('/:postId/new', (req, res, next) => {
    var postId = req.params.id;
    res.redirect('/posts/' + postId)
})

//POST new comment
router.post('/:postId', (req, res, next) => {
    console.log("HI");
    var postId = req.params.postId; 
    req.body.post = postId;
    req.body.author = req.user.id;
    Comment.create(req.body, (error, comment) => {
        if(error) return next(error);
        Post.findByIdAndUpdate(postId, {$push:{"comments":comment.id}}, (error, post) => {
            if(error) return next(error);
            res.redirect('/comments/' + postId);
        })
    })
})

// GET comments
router.get('/:id', (req, res, next) => {
    console.log("Hi")
    var postId = req.params.id;
    Comment.find({post: postId}).populate('author').populate('post').exec((error, comments) => {
        Post.findById(postId).populate('author').exec((error, post) => {
        res.render('eachpost', {comments, post})
        })
    })
})

// Delete comments 
router.get('/:id/delete', (req, res, next) => {
    console.log("HiHhi")
    var commentId = req.params.id;
    Comment.findById(commentId, (error, comment) => {
        if(error) return next(error);
        console.log(comment.author," ", req.user.id)
        if(comment.author == req.user.id){
            Comment.findByIdAndDelete(commentId, (err, comment) => {
                Post.findByIdAndUpdate(comment.post, {$pull:{comments: commentId}}, (error, post)=>{
                    res.redirect('/comments/'+comment.post);
                })
            })
        }else {
            res.redirect('/comments/'+comment.post);
        }
    })
})

// POST like 
router.get('/:id/like', (req, res, next) => {
    console.log("HI")
    var commentId = req.params.id;
    Comment.findByIdAndUpdate(commentId, {$inc:{likes:1}}, (error, comment) => {
        if(error) return next(error);
        res.redirect("/comments/"+comment.post);
    })
})

module.exports = router;


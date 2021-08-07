var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

var Post = require('../models/Post');
var User = require('../models/User');
var Comment = require('../models/Comment')

var uploadPath = path.join(__dirname, '../', 'public/uploads');
// Strorage for Uploaded Files

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null,  Date.now() + '-' + file.originalname );
  }
})
var upload = multer({ storage: storage })

// GET new post 
router.get('/new', (req, res, next) => {
    console.log("HI")
   res.render('tempPost');
})

//POST new post
router.post('/', upload.single('media'), (req, res, next) => {
    console.log(req.file)
    // return res.send(req.body);
    const userId = req.user.id;
    req.body.author = userId;
    if(req.file){
        let formatName = req.file.filename.split(".").pop();
        let imageFormats = ['jpg', 'jpeg', 'png', 'gif'];
        let videoFormats = ['mp4', 'avi', 'mkv', 'webm'];
        if(imageFormats.includes(formatName)){
            console.log((formatName));
            req.body.imageFile = req.file.filename;
        }else if(videoFormats.includes(formatName)){
            req.body.videoFile = req.file.filename;
        } 
    }
    Post.create(req.body, (error, post) => {
        if(error) return next(error);
        User.findByIdAndUpdate(userId, {$push:{"posts":post.id}}, (error, user) => {
            res.redirect('/profile');
        })
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
router.get('/:id/like', (req, res, next) => {
    var postId = req.params.id;
    Post.findByIdAndUpdate(postId, {$inc:{likes:1}}, (error, post) => {
        if(error) return next(error);
        res.redirect("/profile");
    })
})
//DELETE delete
router.get('/:id/delete', (req, res, next) => {
    var postId = req.params.id;
    Post.findByIdAndDelete(postId,(error, post) => {
        if(error) return next(error);
        Comment.deleteMany({post: postId}, (error, comments) => {
            if(error) return next(error);
            User.findByIdAndUpdate(post.author,{$pull:{"posts":postId}},(error, user)=> {
                res.redirect('/profile');
            })
        })
    })
})

module.exports = router;


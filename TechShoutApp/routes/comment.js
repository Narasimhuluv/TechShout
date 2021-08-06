var express = require('express');
var router = express.Router();

var Comment = require('../models/Comment')

router.post('/', (req, res, next) => {
    // req.body.author =   
    Comment.create(req.body, (error, post) => {
        if(error) return next(error);
        res.send(post);
    })
})

module.exports = router;


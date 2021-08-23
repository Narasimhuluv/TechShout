var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
    content: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref:"User", required: true},
    comments:[{type: Schema.Types.ObjectId, ref:"Comment"}],
    likes: {type: Number, default: 0},
    retweets: [{type: Schema.Types.ObjectId, ref:"User"}],
    imageFile: {type: String},
    videoFile: {type: String},
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema);
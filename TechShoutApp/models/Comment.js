var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    content: {type: String, required: true},
    post: {type: Schema.Types.ObjectId, ref:"Post"},
    user: {type: Schema.Types.ObjectId, ref:"User"},
    likes: {type: Number, default: 0},
    dislikes: {type: Number, default: 0}
}, {timestamps: true})

module.exports = mongoose.model('Comment', commentSchema);
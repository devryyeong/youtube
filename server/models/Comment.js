const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = mongoose.Schema({
    //댓글 쓴 사람 정보
    writer: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //댓글을 단 게시물 정보
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },
    //대댓글을 달려고 하는 그 댓글 정보
    responseTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    }

}, { timestamps: true })


const Comment = mongoose.model('Comment', commentSchema);

module.exports = { Comment }
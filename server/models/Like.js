const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    //좋아요 누른 사람의 Id
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    //댓글 좋아요의 Id
    commentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    },
    //게시물 좋아요의 정보
    videoId: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    },

}, { timestamps: true })


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }
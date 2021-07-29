const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: { //쓰는사람의 ID. User모델의 모든 정보를 긁어올 수 있음.
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: { 
        type: String,
        maxlength: 50
    },
    description: {
        type: String
    },
    privacy: { //0:privacy, 1:public
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {
        type: Number,
        default: 0 //0부터 시작
    },
    duration: {
        type: String
    },
    thumbnail: {
        type: String
    }
}, {timestamps: true}) //Create,Update Date 표시

const Video = mongoose.model('Video', videoSchema);

module.exports = { Video };
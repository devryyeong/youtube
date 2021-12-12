const express = require('express');
const router = express.Router();
const { Comment } = require("../models/Comment");

//=================================
//             Comment
//=================================


router.post('/saveComment', (req, res)=>{
    //Client에서 불러온 정보들을 req.body로 모두 다 받아서 넣어줌
    const comment=new Comment(req.body)

    comment.save((err, comment)=>{
        if(err) return res.status(400).json({success:false, err})

        //저장한거의 전체 정보를 가져오려면? save할 때는 populate을 쓸 수가 없어??
        Comment.find({'_id': comment._id})
        .populate('writer')
        .exec((err, result)=>{
            if(err) return res.json({success:false, err});
            res.status(200).json({success:true, result});
        })
    })
});

router.post('/getComments', (req, res)=>{
    Comment.find({'postId': req.body.videoId})
    .populate('writer')
    .exec((err, comments)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, comments})
    })
});


module.exports = router;
const express = require('express');
const router = express.Router();
const { Like } = require('../models/Like');
const { Dislike } = require('../models/Dislike');

//=================================
//             Like
//=================================


router.post('/getLikes', (req, res)=>{
    let variable = {}

    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Like.find(variable)
    .exec((err, likes)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, likes})
    })
});

router.post('/getDislikes', (req, res)=>{
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.find(variable)
    .exec((err, dislikes)=>{
        if(err) return res.status(400).send(err)
        res.status(200).json({success:true, dislikes})
    })
});


router.post('/upLike', (req, res)=>{
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    //Like collection에 클릭 정보를 넣어주고
    const like=new Like(variable)
    like.save((err, likeResult)=>{
        if(err) return res.json({ success: false, err})

        //싫어요 버튼이 이미 클릭되어있는 경우 싫어요 1 내려야함
        Dislike.findByIdAndDelete(variable)
        .exec((err, dislikeResult)=>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true})
        })
    })
});

router.post('/unLike', (req, res)=>{
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Like.findByIdAndDelete(variable)
    .exec((err, result)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
});

router.post('/upDislike', (req, res)=>{
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    //Dislike collection에 클릭 정보를 넣어주고
    const dislike=new Dislike(variable)
    dislike.save((err, dislikeResult)=>{
        if(err) return res.json({ success: false, err})

        //좋아요 버튼이 이미 클릭되어있는 경우 싫어요 1 내려야함
        Like.findByIdAndDelete(variable)
        .exec((err, likeResult)=>{
            if(err) return res.status(400).json({success:false, err})
            res.status(200).json({success:true})
        })
    })
});

router.post('/unDislike', (req, res)=>{
    let variable = {}
    
    if(req.body.videoId){
        variable = {videoId: req.body.videoId}
    }else{
        variable = {commentId: req.body.commentId}
    }

    Dislike.findByIdAndDelete(variable)
    .exec((err, result)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
});

module.exports = router;
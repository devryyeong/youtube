const express = require('express');
const router = express.Router();
const { Subscriber } = require("../models/Subscriber");

//=================================
//             Subscribe
//=================================

router.post('/subscribeNumber', (req, res) => {
    //userTo를 넣어줘야 함.
    Subscriber.find({'userTo': req.body.userTo})
    .exec((err, subscribe)=>{
        //subscribe: userTo를 구독하는 수만큼의 모든 케이스가 들어있음
        //subscribeNumber라는 이름으로 length를 넘기면 그게 곧 구독자 수
        console.log('subscribe: '+subscribe);
        if(err) return res.status(400).send(err);
        return res.status(200).json({success:true, subscribeNumber: subscribe.length})
    })
});

router.post('/subscribed', (req, res) => {
    Subscriber.find({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, subscribe)=>{
        if(err) return res.status(400).send(err);

        //userTo와 userFrom을 둘다 포함하고 있으면 구독중이라는 뜻
        let result=false;
        if(subscribe.length!==0){
            result=true;
        }
        res.status(200).json({success:true, subscribed: result})
    })
});

router.post('/unSubscribe', (req, res) => {
    Subscriber.findOneAndDelete({'userTo': req.body.userTo, 'userFrom': req.body.userFrom})
    .exec((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true, doc})
    })
});

router.post('/subscribe', (req, res) => {
    //userTo, userFrom 정보를 저장하기 위해 인스턴스를 먼저 만들어야함
    const subscribe=new Subscriber(req.body)
    subscribe.save((err, doc)=>{
        if(err) return res.status(400).json({success:false, err})
        res.status(200).json({success:true})
    })
});

module.exports = router;
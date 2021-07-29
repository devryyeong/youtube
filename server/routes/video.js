const express = require('express');
const router = express.Router();
const multer = require('multer');
var ffmpeg = require('fluent-ffmpeg');

const { Video } = require("../models/Video");
const { auth } = require("../middleware/auth");


//STORAGE MULTER CONFIG
let storage = multer.diskStorage({
    //파일 저장할 위치 지정
    destination: (req, file, cb)=>{
        cb(null, "uploads/");
    },
    //저장할 때 파일 이름 지정
    filename: (req, file, cb)=>{
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb)=>{
        const ext=path.extname(file.originalname)
        if(ext!== '.mp4' || ext!=='.png' || ext!=='.jpg'){
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, true)
    }
});

var upload = multer({storage: storage}).single("file");

//=================================
//             Video
//=================================

router.post('/uploadfiles', (req, res) => { //index.js를 거쳐오므로 '/api/video' 생략
    //비디오를 서버에 저장
    upload(req, res, err=>{
        if(err){
            return res.json({success : false, err})
        }
        //업로드되는 경로를 client로 보냄.
        return res.json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
})

router.post('/uploadVideo', (req, res) => {
    //비디오 정보들을 저장
    const video = new Video(req.body) //client의 모든 variables가 담겨져있음

     //mongoDB에 저장(mongoDB-Cluster-Collenctions에서 확인 가능)
    video.save((err, doc)=>{
        if(err) return res.json({success: true, err: err})
        res.status(200).json({success: true})
    })
})

router.get('/getVideos', (req, res) => {
    //비디오 정보들을 DB에서 가져와서 client에 보냄 
    Video.find()
        .populate('writer') //ObjectId를 기반으로 writer의 다른 collection의 정보들을 함께 담아서 출력
        .exec((err, videos)=>{
            if(err) return res.status(400).send(err);
            res.status(200).json({success: true, videos})
        })
    
})



router.post('/thumbnail', (req, res) => { 
    //비디오 러닝타임 가져오기
    //ffprobe:자동으로 metadata를 가져옴
    let filePath="";
    let fileDuration="";

    ffmpeg.ffprobe(req.body.filePath, function(err, metadata){
        console.dir(metadata); //all metadata
        console.log(metadata.format.duration);
        fileDuration=metadata.format.duration
    });

    //썸네일 생성
    ffmpeg(req.body.filePath) //client에서 온 비디오 저장 경로를 가지고,
    .on('filenames', function (filenames) { //썸네일 파일 이름 생성
        console.log('Will generate '+filenames.join(', '))
        console.log(filenames)
        filePath="uploads/thumbnails/"+filenames[0] 
    })
    .on('end', function () { //생성한 썸네일로 뭘 할것인지
        console.log('Screenshots taken');
        return res.json({success: true, url: filePath, fileDuration: fileDuration});
    })
    .on('error', function (err) { //에러처리
        console.log(err);
        return res.json({success: false, err});
    })
    .screenshots({
        //Will take screenshots at 20%, 40%, 60% and 80% of the video
        count: 3,
        folder: 'uploads/thumbnails',
        size: '320x240',
        //'%b': input basename(filename w/o extension)
        filename: 'thumbnail-%b.png'
    })
})

module.exports = router;
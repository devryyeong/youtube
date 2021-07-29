const express = require('express');
const router = express.Router();
//const { Video } = require("../models/Video");

const { auth } = require("../middleware/auth");
const multer = require('multer');

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

const upload = multer({storage: storage}).single("file");

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
        return res.json({success: true, url: res.req.file.path, fileName: res.req.file.filename})
    })
})

module.exports = router;
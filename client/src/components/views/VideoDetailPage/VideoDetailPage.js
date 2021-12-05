import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';

function VideoDetailPage(props) {

    //App.js에서 url parameter로 :videoId라고 썼기 때문
    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    //Comments에 comment의 모든 정보가 들어있음
    const [Comments, setComments] = useState([])


    //DB에 videoId를 요청하기 위해 useEffect로 axios post요청을 보내자
    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if (response.data.success) {
                    //console.log(response.data.videoDetail)
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert('비디오 정보 가져오기 실패')
                }
            })

            //(responseTo를 받아오려면) 모든 comment 정보들을 DB에서 가져와야 함
            axios.post('/api/comment/getComments', variable)
            .then(response=>{
                if(response.data.success){
                    console.log(response.data.comments)
                    setComments(response.data.comments)
                }else{
                    alert('댓글 정보 가져오기 실패')
                }
            })
    }, [])

    //Comments를 업데이트 -> newComment를 추가!
    const refreshFunc=(newComment)=>{
        setComments(Comments.concat(newComment))
    }


    //VideoDetail.writer가 있으면 먼저 렌더링한 후, image 렌더링
    if(VideoDetail.writer){

        //console.log('VideoDetail: '+VideoDetail.writer);
        const subscribeBtn = VideoDetail.writer._id!==localStorage.getItem('userId') && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')}/>

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{width:'100%', padding: '3rem 4rem'}}>
                        <video style={{width:'100%'}} src={`http://localhost:5000/${VideoDetail.filePath}`} controls autoplay/>
                        
                        <List.Item
                            actions ={[subscribeBtn]}
                        >
                            <List.Item.Meta
                                avatar={ <Avatar src={VideoDetail.writer.image} /> }
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                            <div></div>

                        </List.Item>

                        {/* Comment */}
                        {/* Comment.js에서 props로 받음 */}
                        <Comment postId={videoId} commentLists={Comments} refreshFunc={refreshFunc}/>
                    </div>

                </Col>
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }else{
        return (
            <div>Loading...</div>
        )
    }
}

export default VideoDetailPage
